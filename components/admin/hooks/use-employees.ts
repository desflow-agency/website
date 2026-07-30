"use client";

import { useEffect, useState } from "react";
import type { Employee } from "../types";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEmployees() {
    try {
      const res = await fetch("/api/admin/employees");

      if (!res.ok) {
        throw new Error(`Błąd odpowiedzi serwera: ${res.status}`);
      }

      const data = await res.json();

      // Zabezpieczenie: jeśli data jest tablicą, ustaw dane, w przeciwnym razie ustaw pustą tablicę
      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data && Array.isArray(data.employees)) {
        // Na wypadek, gdyby API zwracało { employees: [...] }
        setEmployees(data.employees);
      } else {
        console.error("API nie zwróciło tablicy pracowników:", data);
        setEmployees([]);
      }
    } catch (error) {
      console.error("EMPLOYEES ERROR", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  async function removeEmployee(id: string) {
    try {
      await fetch("/api/admin/employees", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      loadEmployees();
    } catch (error) {
      console.error("REMOVE EMPLOYEE ERROR", error);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  return {
    employees,
    loading,
    reload: loadEmployees,
    removeEmployee,
  };
}