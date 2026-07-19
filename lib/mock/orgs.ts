// organizations the user can switch between in the sidebar
export type Org = {
  id: string;
  name: string;
  plan: "Pro" | "Team" | "Free";
  projects: number;
  initial: string;
};

export const ORGS: Org[] = [
  { id: "acme", name: "Acme Inc", plan: "Pro", projects: 4, initial: "A" },
  { id: "northwind", name: "Northwind", plan: "Team", projects: 2, initial: "N" },
  { id: "hooli", name: "Hooli", plan: "Free", projects: 1, initial: "H" },
];
