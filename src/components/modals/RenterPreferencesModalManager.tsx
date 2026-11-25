import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTenantPreferencesApi } from "../../actions/tenantPreferences";
import MatchingPreferencesModal from "./MatchingPreferencesModal";

const PROPERTY_RELATED_ROUTES = [
  "/dashboard",
  "/explore-properties",
  "/saved-properties",
  "/my-posts",
  "/find-property",
];

export const openMatchingPreferencesModal = () => {
  window.dispatchEvent(new CustomEvent("open-matching-preferences"));
};

const RenterPreferencesModalManager: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState<boolean | null>(null);

  // Check if current user has already set up their matching preferences
  const checkPreferences = useCallback(async () => {
    if (!user || user.role !== "TENANT") {
      setHasCompleted(true);
      return;
    }

    try {
      const res = await getTenantPreferencesApi(user.id || user._id);
      setHasCompleted(res.hasSetup);

      // If not completed yet, and on a property-related page, open the popup
      if (!res.hasSetup) {
        const isPropertyPage = PROPERTY_RELATED_ROUTES.some((route) =>
          location.pathname.startsWith(route)
        );
        if (isPropertyPage) {
          setIsOpen(true);
        }
      }
    } catch {
      // In case of error, default to true to not block UI
      setHasCompleted(false);
    }
  }, [user, location.pathname]);

  // Check on user change / login
  useEffect(() => {
    checkPreferences();
  }, [checkPreferences]);

  // Route change handler: if renter has NOT completed preferences, open on property related pages
  useEffect(() => {
    if (!user || user.role !== "TENANT") return;

    if (hasCompleted === false) {
      const isPropertyPage = PROPERTY_RELATED_ROUTES.some((route) =>
        location.pathname.startsWith(route)
      );
      if (isPropertyPage) {
        setIsOpen(true);
      }
    }
  }, [location.pathname, hasCompleted, user]);

  // Global listener for clicking on any Match Percentage badge
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-matching-preferences", handleOpenEvent);
    return () => {
      window.removeEventListener("open-matching-preferences", handleOpenEvent);
    };
  }, []);

  if (!user || user.role !== "TENANT") return null;

  return (
    <MatchingPreferencesModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSaved={() => {
        setHasCompleted(true);
        setIsOpen(false);
      }}
    />
  );
};

export default RenterPreferencesModalManager;
