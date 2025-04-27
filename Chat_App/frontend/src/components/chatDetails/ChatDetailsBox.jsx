import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Container, Row, Col, Button } from "reactstrap";
import Overview from "./Overview";
import Member from "./Member";
import ChatSetting from "./ChatSetting";

const ChatDetailsBox = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [detailView, setDetailView] = useState("overview"); // ✅ Default is overview

	return (
		<Container fluid className="d-flex flex-column h-100 pt-3">
			<Row className="h-100">
				{/* Sidebar Navigation */}
				<Col xs="auto" className="pb-4 bg-dark flex align-items-start gap-2">
					<Button
						color={detailView === "overview" ? "primary" : "secondary"}
						className="d-flex align-items-center gap-1 px-1"
						onClick={() => setDetailView("overview")}
						title="Overview"
					>
						<CiCircleInfo size={18} />
						<span className="d-none d-md-block">Overview</span>
					</Button>

					{selectedChat?.isGroupChat && (
						<Button
							color={detailView === "members" ? "primary" : "secondary"}
							className="d-flex align-items-center gap-1 px-1"
							onClick={() => setDetailView("members")}
							title="Members"
						>
							<HiOutlineUsers size={18} />
							<span className="d-none d-md-block">Members</span>
						</Button>
					)}

					<Button
						color={detailView === "setting" ? "primary" : "secondary"}
						className="d-flex align-items-center gap-1 px-1"
						onClick={() => setDetailView("setting")}
						title="Settings"
					>
						<IoSettingsOutline size={18} />
						<span className="d-none d-md-block">Settings</span>
					</Button>
				</Col>

				{/* Main Content */}
				<Col className="h-100 border-t">
					<div className="h-100 overflow-auto">
						{/* ✅ Ensure the correct component is displayed */}
						{detailView === "overview" && <Overview />}
						{detailView === "members" && <Member />}
						{detailView === "setting" && <ChatSetting />}
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default ChatDetailsBox;
