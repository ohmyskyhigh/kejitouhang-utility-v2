"use client";
import { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

type MenuItem = Required<MenuProps>["items"][number];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <section>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Header style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
            <div className="demo-logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              items={items}
              style={{ flex: 1, minWidth: 0 }}
            />
          </Header>
          <Content style={{ margin: "0 16px", "display": "flex" }}>{children}</Content>
          <Footer style={{ textAlign: "center" }}>
            科技投行工具箱
          </Footer>
        </Layout>
      </Layout>
    </section>
  );
}
