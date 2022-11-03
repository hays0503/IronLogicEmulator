import React, { useState } from "react";
import "antd/dist/antd.min.css";
import "./index.css";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Monitor } from "./Monitor";

const { Header, Sider, Content } = Layout;
const App = () => {
	const [collapsed, setCollapsed] = useState(false);
	return (
		<Layout style={{ height: "100%" }}>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div className="logo">
					Эмулятор Z5Rweb <br /> WEB-Json{" "}
				</div>
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={["1"]}
					items={[
						{
							key: "1",
							icon: <UploadOutlined />,
							label: "Монитор",
						},
						{
							key: "2",
							icon: <VideoCameraOutlined />,
							label: "Меню контролера",
						},
						{
							key: "3",
							icon: <UserOutlined />,
							label: "Меню сервера",
						},
					]}
				/>
			</Sider>
			<Layout className="site-layout">
				<Header
					className="site-layout-background"
					style={{
						padding: 0,
					}}
				>
					{React.createElement(
						collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
						{
							className: "trigger",
							onClick: () => setCollapsed(!collapsed),
						}
					)}
				</Header>
				<Content
					className="site-layout-background"
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
					}}
				>
					<Monitor/>
				</Content>
			</Layout>
		</Layout>
	);
};
export default App;
