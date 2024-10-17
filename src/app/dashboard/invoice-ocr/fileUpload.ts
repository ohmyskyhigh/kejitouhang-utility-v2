"use server";
import { Ticket, useInoviceStore } from "@/store/invoiceStore";
import { NextResponse } from "next/server";
import ocr_api20210707, * as $ocr_api20210707 from '@alicloud/ocr-api20210707';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
import * as stream from 'stream';
import { invoiceJSONConversion } from './tongyi-ai';

const api = `${process.env.NEXT_PUBLIC_API_URL}/invoice-ocr/recognize`;

// 初始化 OCR 客户端
const endpoint = 'ocr-api.cn-hangzhou.aliyuncs.com';
const config = new $OpenApi.Config({
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
});
config.endpoint = endpoint;
const client = new ocr_api20210707(config);


async function processInvoice(file: File, filename: string): Promise<Ticket[]> {
  const fileBuffer = await file.arrayBuffer();

  // 创建一个可读流
  const fileReadStream = new stream.Readable();
  fileReadStream._read = () => {};
  fileReadStream.push(Buffer.from(fileBuffer));
  fileReadStream.push(null);

  const recognizeMixedInvoicesRequest = new $ocr_api20210707.RecognizeMixedInvoicesRequest({
    url: `${endpoint}/recognize-mixed-invoices`,
    body: fileReadStream,
  });
  const runtime = new $Util.RuntimeOptions({});
  const response = await client.recognizeMixedInvoicesWithOptions(
    recognizeMixedInvoicesRequest,
    runtime,
  );

  let data = response.body?.data;
  if (!data) {
    throw new Error('响应体中没有数据');
  }
  let json = JSON.parse(data);
  let subMsgs = json.subMsgs;
  let invoiceDataRaw = subMsgs.map((subMsg: any) => ({
    type: subMsg.type,
    data: subMsg.result.data,
  }));

  let invoiceDataAI = await invoiceJSONConversion(
    JSON.stringify(invoiceDataRaw),
  );
  console.log('处理发票完成', invoiceDataAI);
  // 移除可能存在的 "```" 标记
  invoiceDataAI = invoiceDataAI.replace(/^```json\s*|\s*```$/g, '').trim();

  let parsedInvoiceData;
  try {
    parsedInvoiceData = JSON.parse(invoiceDataAI);
  } catch (error) {
    console.error('解析 invoiceDataAI 时出错:', error);
    throw new Error('无法解析 AI 处理后的发票数据');
  }

  if (!Array.isArray(parsedInvoiceData)) {
    throw new Error('AI 处理后的发票数据格式不正确，应为数组');
  }
  return parsedInvoiceData.map((item: any) => ({
    filename,
    ...item,
  }));
}

export async function handleFileSubmit(
  formData: FormData, filename: string
): Promise<Ticket[] | null> {
  if (!formData) return null;
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('没有找到文件');
    }
    console.log('开始处理发票', file);
    const invoiceData = await processInvoice(file, filename);
    console.log('处理发票完成', invoiceData);
    return invoiceData;
  } catch (error) {
    console.error("处理发票时出错:", error);
    return null;
  }
}