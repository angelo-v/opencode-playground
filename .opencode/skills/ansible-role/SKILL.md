---
name: ansible-role
description: Create Ansible roles with proper directory structure, tasks, variables, handlers, and templates following best practices. Generate minimal viable roles with idempotent tasks, proper YAML formatting, role-prefixed variables, and tags. Use when creating new Ansible roles, even if user says 'create a role for X' or 'I need an Ansible playbook component'.
license: MIT
compatibility: opencode
metadata:
  technology: ansible
  domain: infrastructure-as-code
  workflow: role-creation
---

# Skill: ansible-role

## What I do

- Create standard Ansible role directory structures
- Generate task files with idempotent patterns
- Set up default variables with role-prefixed naming
- Create handlers for service management
- Generate template files with Jinja2 examples
- Write comprehensive README documentation
- Follow Ansible best practices for YAML formatting
- Ensure all tasks include tags for selective execution
- Keep roles minimal and extend only when requested

## When to use me

Use this skill when:
- User asks to create an Ansible role
- User says "create a role for [purpose]"
- User needs to automate infrastructure configuration
- User mentions setting up servers, services, or applications with Ansible
- User wants to organize Ansible tasks into reusable components
- Even when user doesn't explicitly say "Ansible role" but describes automation needs

## Best practices I follow

### 1. Minimal viable role structure

Start with only essential directories:
- `tasks/` - Required: main task definitions
- `defaults/` - Required: default variable values
- `handlers/` - Only if needed: service restart handlers
- `templates/` - Only if needed: configuration file templates
- `README.md` - Required: usage documentation

**Do NOT create** these unless specifically requested:
- `vars/` - Only for non-overridable variables (rarely needed)
- `files/` - Only when static files need to be copied
- `meta/` - Only for Galaxy or role dependencies
- `tests/` or `molecule/` - Only when testing is explicitly requested
- `library/` - Only for custom modules

### 2. Idempotent task design

All tasks must be safe to run multiple times:

```yaml
# Good - idempotent
- name: Ensure nginx is installed
  ansible.builtin.apt:
    name: nginx
    state: present
  tags: [packages, nginx]

# Good - idempotent with state checking
- name: Ensure nginx is running
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: true
  tags: [services, nginx]

# Bad - not idempotent (runs every time)
- name: Download file
  ansible.builtin.command: wget https://example.com/file.tar.gz
```

Use these patterns:
- `state: present/absent` for packages
- `state: started/stopped` for services
- `creates:` parameter for commands
- Check before modify patterns

### 2a. Security: Script download verification

**CRITICAL**: When downloading and executing external scripts, ALWAYS verify SHA256 checksums.

- Use `get_url` module with `checksum: "sha256:{{ checksum_variable }}"` parameter
- The `get_url` module will automatically fail if checksum doesn't match (no additional verification needed)
- Store the expected checksum in `defaults/main.yml` with comment explaining how to update it
- Tag download tasks with `security`
- Never use `curl | bash` or similar patterns that skip verification

### 3. YAML formatting standards

Follow these conventions:

```yaml
---
# Always start with three dashes
# Use 2-space indentation
# Use list syntax for tasks (dash + space)

- name: Clear, descriptive task name in sentence case
  module.name:
    parameter: value
    another_parameter: value
  tags: [category, specific]
  when: condition is true

# Use block syntax for related tasks
- name: Configure application
  block:
    - name: Copy configuration file
      ansible.builtin.template:
        src: app.conf.j2
        dest: /etc/app/app.conf
        mode: '0644'
      notify: restart app
      
    - name: Ensure app is enabled
      ansible.builtin.service:
        name: app
        enabled: true
  tags: [config, app]
```

### 4. Variable naming with role prefix

Always prefix variables with the role name to avoid conflicts:

```yaml
# defaults/main.yml
---
# Good - role-prefixed variables
nginx_version: latest
nginx_port: 80
nginx_worker_processes: auto
nginx_enable_ssl: false
nginx_ssl_cert_path: /etc/ssl/certs/nginx.crt

# Bad - generic names that conflict
version: latest
port: 80
enable_ssl: false
```

### 5. Tags for selective execution

Every task should have meaningful tags:

```yaml
- name: Install packages
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  loop: "{{ nginx_packages }}"
  tags: [packages, nginx, install]

- name: Configure nginx
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: restart nginx
  tags: [config, nginx]

- name: Ensure nginx is running
  ansible.builtin.service:
    name: nginx
    state: started
  tags: [services, nginx]
```

Common tag categories:
- `packages` - Package installation tasks
- `config` - Configuration file management
- `services` - Service management
- `install` - Initial setup tasks
- `security` - Security-related tasks (checksums, verification, authentication)
- `verify` - Verification and validation tasks
- `cleanup` - Cleanup and temporary file removal
- Always include the service/app name as a tag

## Questions to ask

When the user request lacks detail, use the Question tool to ask:

1. **What is the role's primary purpose?** (e.g., web server, database, monitoring)
2. **Which OS family is this targeting?** (Debian/Ubuntu, RedHat/CentOS, both)
3. **Does this role need to manage services?** (if yes, create handlers/)
4. **Does this role need configuration templates?** (if yes, create templates/)
5. **What packages need to be installed?** (for tasks/main.yml)
6. **Should this role support both install and removal?** (affects variable design)
7. **For installation scripts: Should the role support multiple variants/engines/versions, or just one specific option?** (Keep it minimal unless user needs flexibility)
8. **Does the installation involve downloading external scripts or binaries?** (if yes, implement checksum verification)

## Standard role structure

```
role-name/
├── tasks/
│   └── main.yml          # Main task entry point
├── defaults/
│   └── main.yml          # Default variables (user-overridable)
├── handlers/
│   └── main.yml          # Service restart handlers (only if needed)
├── templates/
│   └── config.j2         # Jinja2 templates (only if needed)
└── README.md             # Documentation and examples
```

## Example workflow

**User:** "Create an Ansible role for nginx"

**Response:**

I'll create a minimal Ansible role for nginx. Let me ask a few questions first:

*[Uses Question tool to ask about OS family, configuration needs, SSL requirements]*

Based on your answers, I'll create:

1. **Directory structure** - Standard Ansible role layout
2. **tasks/main.yml** - Nginx installation and service management
3. **defaults/main.yml** - Configurable variables (port, worker processes, etc.)
4. **handlers/main.yml** - Service restart handler
5. **templates/nginx.conf.j2** - Basic nginx configuration template
6. **README.md** - Usage instructions and examples

*[Creates the role files with proper formatting, idempotent tasks, role-prefixed variables, and appropriate tags]*

**User:** "Add SSL support"

**Response:**

I'll extend the role with SSL configuration:

*[Adds SSL-related variables to defaults/main.yml, SSL configuration tasks with when conditions, and updates templates/nginx.conf.j2]*

## Template: tasks/main.yml

```yaml
---
# tasks/main.yml

- name: Include OS-specific variables
  ansible.builtin.include_vars: "{{ ansible_os_family }}.yml"
  tags: [always]

- name: Ensure required packages are installed
  ansible.builtin.package:
    name: "{{ rolename_packages }}"
    state: present
  tags: [packages, install, rolename]

- name: Ensure configuration directory exists
  ansible.builtin.file:
    path: "{{ rolename_config_dir }}"
    state: directory
    mode: '0755'
  tags: [config, rolename]

- name: Deploy configuration file
  ansible.builtin.template:
    src: config.j2
    dest: "{{ rolename_config_path }}"
    mode: '0644'
    validate: "{{ rolename_validate_command }}"
  notify: restart rolename
  tags: [config, rolename]

- name: Ensure service is started and enabled
  ansible.builtin.service:
    name: "{{ rolename_service_name }}"
    state: started
    enabled: true
  tags: [services, rolename]
```

## Template: defaults/main.yml

```yaml
---
# defaults/main.yml

# Package configuration
rolename_packages:
  - package-name

# Service configuration
rolename_service_name: service-name
rolename_service_state: started
rolename_service_enabled: true

# Path configuration
rolename_config_dir: /etc/rolename
rolename_config_path: "{{ rolename_config_dir }}/config.conf"

# Application configuration
rolename_port: 8080
rolename_enable_feature: false
```

## Template: handlers/main.yml

```yaml
---
# handlers/main.yml

- name: restart rolename
  ansible.builtin.service:
    name: "{{ rolename_service_name }}"
    state: restarted
  tags: [handlers, rolename]

- name: reload rolename
  ansible.builtin.service:
    name: "{{ rolename_service_name }}"
    state: reloaded
  tags: [handlers, rolename]
```

## Validation checklist

Before finalizing a role, verify:

- [ ] Directory structure follows Ansible conventions
- [ ] All variables are prefixed with role name
- [ ] tasks/main.yml exists and is valid YAML
- [ ] defaults/main.yml exists with sensible defaults
- [ ] All tasks have descriptive names
- [ ] All tasks include appropriate tags
- [ ] Tasks are idempotent (safe to run multiple times)
- [ ] Handlers are only created if needed
- [ ] Templates are only created if needed
- [ ] Downloaded scripts/binaries are verified with checksums
- [ ] Checksum variables are documented in defaults/main.yml
- [ ] README.md documents all variables and usage
- [ ] README.md includes instructions for updating checksums
- [ ] YAML formatting follows 2-space indentation
- [ ] No unnecessary directories created
- [ ] No support for multiple variants unless explicitly requested
- [ ] Security tags applied to verification tasks
