import { useEffect, useRef, useState } from "react";
import { uniqBy } from "lodash"; // 引入 lodash 的 uniqBy 函数
import { handleFileSubmit } from "./fileUpload";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  message,
  Upload as AntdUpload,
  UploadFile,
  Button,
  GetProp,
} from "antd";
import { useInoviceStore, Ticket, useSheetStore } from "@/store/invoiceStore";

const { Dragger } = AntdUpload;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function Upload() {
  const { clearTickets, addTicket } = useInoviceStore();
  const { sheet, addTicket2Sheet } = useSheetStore();
  const [selectedFiles, setSelectedFile] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file, fileList) => {
      const uniqueFiles = uniqBy(
        [...fileList, ...selectedFiles],
        (f: UploadFile) => f.name
      ); // 使用文件名作为唯一标识符
      setSelectedFile(uniqueFiles);
      return false;
    },
  };

  function storeInvoiceData(data: Ticket[]) {
    addTicket2Sheet(data);
  }

  const fileUpload = async () => {
    console.log(selectedFiles);
    const promises = selectedFiles.map(async (file) => {
      let formData = new FormData();
      formData.append("file", file as FileType);
      return handleFileSubmit(formData, file.name as string);
    });

    const results = await Promise.all(promises);
    results.forEach((res) => {
      console.log(res);
      storeInvoiceData(res as Ticket[]);
    });
  };

  return (
    <div className="sheet flex-1 h-full w-full bg-gray-200 flex flex-col gap-8">
      <Button type="primary" block onClick={fileUpload}>
        上传并解析发票
      </Button>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
    </div>
  );
}
