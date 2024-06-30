import { CurrentInterestType, CurrentFormData } from "@/types/context";
import { createContext } from "react";

export const CurrentInterestTypeContext = createContext(new CurrentInterestType())

export const CurrentFormDataContext = createContext(new CurrentFormData())