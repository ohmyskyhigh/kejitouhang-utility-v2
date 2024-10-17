"use client";
import Upload from "./upload";
import Sheet from "./sheet";
import { Layout } from "antd";

export default function InvoiceOCR() {

  return (
    <Layout
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "4rem",
        flexGrow: "1",
        height: "100%",
      }}
    >
      <Upload></Upload>
      <Sheet></Sheet>
    </Layout>
  );
}
