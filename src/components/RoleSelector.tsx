/**
 * Role Selector Component
 * Two-tier system: Core (recommended) vs Extended (advanced)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CORE_ROLES, EXTENDED_ROLES } from "@/config/roles";
import { RoleMode, AllRoles, RoleInfo } from "@/types/analyzer";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  selectedRole: AllRoles | null;
  onRoleSelect: (role: AllRoles, mode: RoleMode) => void;
}

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  const [isExtendedOpen, setIsExtendedOpen] = useState(false);

  const handleRoleClick = (role: RoleInfo) => {
    onRoleSelect(role.id, role.isCore ? "core" : "extended");
  };

  return (
    <div className="space-y-6">
      {/* Core Roles Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Core Roles</h3>
          <Badge variant="secondary" className="text-xs">
            Recommended
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Well-tested roles with accurate scoring algorithms
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CORE_ROLES.map((role, index) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onClick={() => handleRoleClick(role)}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>

      {/* Extended Roles Section (Collapsible) */}
      <Collapsible open={isExtendedOpen} onOpenChange={setIsExtendedOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm">Extended Roles</span>
              <Badge variant="outline" className="text-xs border-warning text-warning">
                Advanced
              </Badge>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExtendedOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <AnimatePresence>
            {isExtendedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-3"
              >
                <p className="text-xs text-warning bg-warning/10 p-2 rounded-md">
                  ⚠️ Extended roles have less refined scoring. Results may vary.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXTENDED_ROLES.map((role, index) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      isSelected={selectedRole === role.id}
                      onClick={() => handleRoleClick(role)}
                      delay={index * 0.03}
                      isExtended
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Individual role card component
interface RoleCardProps {
  role: RoleInfo;
  isSelected: boolean;
  onClick: () => void;
  delay?: number;
  isExtended?: boolean;
}

function RoleCard({ role, isSelected, onClick, delay = 0, isExtended = false }: RoleCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={cn(
        "relative w-full p-3 text-left rounded-lg border-2 transition-all duration-200",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/50",
        isExtended && !isSelected && "border-dashed"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {role.label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {role.description}
          </p>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="shrink-0"
          >
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
