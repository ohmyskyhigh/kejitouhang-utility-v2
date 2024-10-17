"use client";
import { useEffect, useRef, useState } from "react";
import { useInoviceStore, Ticket, useSheetStore } from "@/store/invoiceStore";
import Spreadsheet from "react-spreadsheet";

export default function Sheet() {
  const { sheet } = useSheetStore();

  return (
    <div className="sheet flex-2 h-full w-full bg-gray-200 flex-grow-1 overflow-auto">
      <Spreadsheet data={sheet}/>
    </div>
  );
}
