"use client";

import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "@/components/ui/use-toast"; // Import the toast hook

// Extend the kindeUser type
declare module "@kinde-oss/kinde-auth-nextjs" {
  interface KindeUser {
    properties?: {
      "tags-app-column-preferences"?: string;
      // other properties...
    } & Record<string, any>; // Add this line to allow any additional properties
  }
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  columnHeaders: { [key: string]: string };
  tableId: string; // Add tableId to props
}

const KINDE_API_BASE_URL = "https://discrescuenetwork.kinde.com"; // Correct Kinde API base URL

export function DataTableViewOptions<TData>({
  table,
  columnHeaders,
  tableId, // Destructure tableId
}: DataTableViewOptionsProps<TData>) {
  const { user, isAuthenticated, getUser, getAccessToken } = useKindeBrowserClient();
  const accessToken = getAccessToken(); // Get the access token

  useEffect(() => {
    const loadPreferences = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await fetch(`/api/get-user-properties?userId=${user.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error("Failed to load user properties");
          }

          const localKey= `tags-app-column-preferences-${tableId}`;
          console.log(localKey)

          const data = await response.json();
          console.log('Data:', data);
          const columnPreferences = data.properties.find(
            (property: any) => property.key === localKey
          )?.value;
          console.log('Column Preferences:', columnPreferences);

          if (columnPreferences) {
            const preferences = JSON.parse(columnPreferences);
            table.getAllColumns().forEach((column) => {
              const visibility = preferences[column.id];
              if (visibility !== undefined) {
                column.toggleVisibility(visibility);
              }
            });
          }

          // toast({
          //   title: "Success",
          //   description: "Preferences loaded successfully.",
          //   variant: "default",
          //   duration: 3000,
          // });
        } catch (error) {
          console.error("Error loading user properties:", error);
          toast({
            title: "Error",
            description: "Failed to load preferences.",
            variant: "destructive",
            duration: 3000,
          });
        }
      } else {
        table.getAllColumns().forEach((column) => {
          const visibility = Cookies.get(`column-${tableId}-${column.id}-visibility`);
          if (visibility !== undefined) {
            column.toggleVisibility(visibility === "true");
          }
        });
      }
    };

    loadPreferences();
  }, [table, isAuthenticated, tableId]);

  const savePreferences = async (updatedPreferences: { [key: string]: boolean }) => {
    if (isAuthenticated && user) {
      try {
        const response = await fetch('/api/update-user-properties', {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            propertyKey: `tags-app-column-preferences-${tableId}`,
            value: JSON.stringify(updatedPreferences),
            accessToken,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update user properties");
        }

        toast({
          title: "Success",
          description: "Preferences saved successfully.",
          variant: "default",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error updating user properties:", error);
        toast({
          title: "Error",
          description: "Failed to save preferences.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      Object.keys(updatedPreferences).forEach((columnId) => {
        Cookies.set(`column-${tableId}-${columnId}-visibility`, String(updatedPreferences[columnId]));
      });

      toast({
        title: "Success",
        description: "Preferences saved successfully.",
        variant: "default",
        duration: 3000,
      });
    }
  };

  const handleColumnVisibilityChange = async (columnId: string, isVisible: boolean) => {
    const preferences: { [key: string]: boolean } = {};
    table.getAllColumns().forEach((column) => {
      preferences[column.id] = column.getIsVisible();
    });
    preferences[columnId] = isVisible;
    await savePreferences(preferences);
  };

  const resetToDefault = async () => {
    table.getAllColumns().forEach((column) => {
      Cookies.remove(`column-${tableId}-${column.id}-visibility`);
      column.toggleVisibility(true);
    });

    if (isAuthenticated && user) {
      try {
        const response = await fetch('/api/update-user-properties', {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            propertyKey: `tags-app-column-preferences-${tableId}`,
            value: null,
            accessToken,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to reset user properties");
        }

        toast({
          title: "Success",
          description: "Preferences reset to default.",
          variant: "default",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error resetting user properties:", error);
        toast({
          title: "Error",
          description: "Failed to reset preferences.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      toast({
        title: "Success",
        description: "Preferences reset to default.",
        variant: "default",
        duration: 3000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={async (value) => {
                  column.toggleVisibility(!!value);
                  await handleColumnVisibilityChange(column.id, !!value);
                }}
              >
                {columnHeaders[column.id]}
              </DropdownMenuCheckboxItem>
            );
          })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel
          onClick={resetToDefault}
          className="capitalize text-sm cursor-pointer"
        >
          Reset to default
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DataTableViewOptions;