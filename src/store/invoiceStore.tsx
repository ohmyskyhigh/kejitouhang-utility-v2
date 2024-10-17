import { create } from "zustand";
import { Matrix } from "react-spreadsheet";

export interface Ticket {
  type: string;
  purchase: string;
  seller: string;
  location: string;
  amount: string;
  date: string;
  filename: string;
  comment: string;
}

export type Sheet = Matrix<{ value: string }>;


export interface SheetStore {
  sheet: Sheet;
  addTicket2Sheet: (ticket: Ticket[]) => void;
  clearTickets: () => void;
}

interface InvoiceStore {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  clearTickets: () => void;
}

function convertInvoiceReturn(tickets: Ticket[]): Sheet {
  return tickets.map((ticket) => {
    return [
      { value: ticket.type },
      { value: ticket.purchase },
      { value: ticket.seller },
      { value: ticket.location },
      { value: ticket.amount },
      { value: ticket.date },
      { value: ticket.filename },
      { value: ticket.comment },
    ];
  });
}

export const useInoviceStore = create<InvoiceStore>((set) => ({
  tickets: [],
  addTicket: (ticket) =>
    set((state) => ({ 
      tickets: [...state.tickets, ticket] }
    )),
  clearTickets: () => set({ tickets: [] }),
}));


export const useSheetStore = create<SheetStore>((set) => ({
  sheet: [[
    { value: "type" },
    { value: "purchase" },
    { value: "seller" },
    { value: "location" },
    { value: "amount" },
    { value: "date" },
    { value: "filename" },
    { value: "comment" },
  ]],
  addTicket2Sheet: (tickets) =>{
    let rows = convertInvoiceReturn(tickets)
    return set((state) => ({ 
      sheet: [...state.sheet, ...rows] }
    ))},
  clearTickets: () => set({ sheet: [] }),
}));