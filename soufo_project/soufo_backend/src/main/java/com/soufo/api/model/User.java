package com.soufo.api.model;

public class User {
    private Long id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
    private boolean enabled;

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private final User instance = new User();

        public Builder id(Long id) {
            instance.setId(id);
            return this;
        }

        public Builder email(String email) {
            instance.setEmail(email);
            return this;
        }

        public Builder password(String password) {
            instance.setPassword(password);
            return this;
        }

        public Builder firstName(String firstName) {
            instance.setFirstName(firstName);
            return this;
        }

        public Builder lastName(String lastName) {
            instance.setLastName(lastName);
            return this;
        }

        public Builder role(Role role) {
            instance.setRole(role);
            return this;
        }

        public Builder enabled(boolean enabled) {
            instance.setEnabled(enabled);
            return this;
        }

        public User build() {
            return instance;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
