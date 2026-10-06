/* =========================================================
   QUICK HELP - CUSTOMER / SERVICE PROVIDER ROLE SYSTEM
   This file is an add-on for the existing application.
   Do NOT delete or replace script.js.
   ========================================================= */

(function () {
    "use strict";

    // ---------------------------------------------------------
    // 1. Service provider categories
    // ---------------------------------------------------------
    const PROVIDER_TYPES = [
        "Plumber",
        "Electrician",
        "Carpenter",
        "Painter",
        "Other"
    ];

    // ---------------------------------------------------------
    // 2. Get logged-in user from existing app
    // ---------------------------------------------------------
    function getCurrentUser() {
        try {
            const keys = [
                "currentUser",
                "loggedInUser",
                "user",
                "current_user"
            ];

            for (const key of keys) {
                const value = localStorage.getItem(key);

                if (value) {
                    try {
                        const parsed = JSON.parse(value);

                        if (parsed && typeof parsed === "object") {
                            return parsed;
                        }
                    } catch (e) {
                        // Ignore invalid JSON
                    }
                }
            }
        } catch (error) {
            console.log("Role system: unable to read user", error);
        }

        return null;
    }

    // ---------------------------------------------------------
    // 3. Detect whether account is a provider
    // ---------------------------------------------------------
    function isProvider(user) {
        if (!user) return false;

        const workType =
            user.Work_type ||
            user.work_type ||
            user.workType ||
            user.service ||
            user.serviceType ||
            user.roleType;

        if (workType && PROVIDER_TYPES.includes(workType)) {
            return true;
        }

        if (
            user.role === "provider" ||
            user.Role === "provider" ||
            user.userType === "provider" ||
            user.user_type === "provider"
        ) {
            return true;
        }

        return false;
    }

    // ---------------------------------------------------------
    // 4. Detect customer
    // ---------------------------------------------------------
    function isCustomer(user) {
        if (!user) return false;

        return !isProvider(user);
    }

    // ---------------------------------------------------------
    // 5. Save role information
    // ---------------------------------------------------------
    function saveRole(user) {
        if (!user) return;

        const provider = isProvider(user);

        const roleData = {
            role: provider ? "provider" : "customer",
            isProvider: provider,
            isCustomer: !provider
        };

        localStorage.setItem(
            "quickHelpUserRole",
            JSON.stringify(roleData)
        );
    }

    // ---------------------------------------------------------
    // 6. Get saved role
    // ---------------------------------------------------------
    function getSavedRole() {
        try {
            const value =
                localStorage.getItem("quickHelpUserRole");

            if (!value) return null;

            return JSON.parse(value);
        } catch (error) {
            return null;
        }
    }

    // ---------------------------------------------------------
    // 7. Hide customer/provider specific elements
    // ---------------------------------------------------------
    function applyRoleUI() {
        const user = getCurrentUser();

        if (!user) {
            return;
        }

        saveRole(user);

        const provider = isProvider(user);

        document.body.classList.toggle(
            "quick-help-provider",
            provider
        );

        document.body.classList.toggle(
            "quick-help-customer",
            !provider
        );

        // Provider dashboard button
        const dashboardButtons =
            document.querySelectorAll(
                "#providerDashboardBtn, .provider-dashboard-btn, [data-provider-dashboard]"
            );

        dashboardButtons.forEach(function (button) {
            button.style.display = provider ? "" : "none";
        });
    }

    // ---------------------------------------------------------
    // 8. Provider-only check
    // ---------------------------------------------------------
    function requireProvider(callback) {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login first.");
            return false;
        }

        if (!isProvider(user)) {
            alert(
                "This option is available only for Service Providers."
            );
            return false;
        }

        if (typeof callback === "function") {
            callback(user);
        }

        return true;
    }

    // ---------------------------------------------------------
    // 9. Customer-only check
    // ---------------------------------------------------------
    function requireCustomer(callback) {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login first.");
            return false;
        }

        if (isProvider(user)) {
            alert(
                "This option is available for Customers."
            );
            return false;
        }

        if (typeof callback === "function") {
            callback(user);
        }

        return true;
    }

    // ---------------------------------------------------------
    // 10. Provider card filter
    // ---------------------------------------------------------
    function filterProvidersOnly(list) {
        if (!Array.isArray(list)) {
            return [];
        }

        return list.filter(function (provider) {
            if (!provider) return false;

            const workType =
                provider.Work_type ||
                provider.work_type ||
                provider.workType ||
                provider.service ||
                provider.serviceType;

            const role =
                provider.role ||
                provider.Role ||
                provider.userType ||
                provider.user_type;

            // Never show normal customers
            if (role === "customer") {
                return false;
            }

            // Provider must have a service/work type
            if (!workType) {
                return false;
            }

            return true;
        });
    }

    // ---------------------------------------------------------
    // 11. Filter by category
    // ---------------------------------------------------------
    function filterByServiceType(list, serviceType) {
        const providers = filterProvidersOnly(list);

        if (!serviceType || serviceType === "All") {
            return providers;
        }

        return providers.filter(function (provider) {
            const type =
                provider.Work_type ||
                provider.work_type ||
                provider.workType ||
                provider.service ||
                provider.serviceType;

            return String(type).toLowerCase() ===
                String(serviceType).toLowerCase();
        });
    }

    // ---------------------------------------------------------
    // 12. Expose functions for existing app
    // ---------------------------------------------------------
    window.QuickHelpRoles = {
        PROVIDER_TYPES,
        getCurrentUser,
        isProvider,
        isCustomer,
        saveRole,
        getSavedRole,
        applyRoleUI,
        requireProvider,
        requireCustomer,
        filterProvidersOnly,
        filterByServiceType
    };

    // ---------------------------------------------------------
    // 13. Run after page loads
    // ---------------------------------------------------------
    document.addEventListener(
        "DOMContentLoaded",
        function () {
            setTimeout(function () {
                applyRoleUI();
            }, 500);
        }
    );

    console.log(
        "Quick Help Role System loaded successfully."
    );

})();
