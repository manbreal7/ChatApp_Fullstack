import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	Navbar,
	Nav,
	NavItem,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button,
	Container,
} from "reactstrap";
import Logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	// Auth fetch
	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.error(err);
				dispatch(setLoading(false));
			});
	};

	// On mount
	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		} else {
			navigate("/signin");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);

	const { pathname } = useLocation();
	useEffect(() => {
		if (user) navigate("/");
		else if (pathname !== "/signin" && pathname !== "/signup")
			navigate("/signin");
		handleScrollTop();
	}, [pathname, user]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	// Dropdown toggle
	const [dropdownOpen, setDropdownOpen] = React.useState(false);
	const toggleDropdown = () => setDropdownOpen((prev) => !prev);

	return (
		<Navbar
			color="dark"
			dark
			fixed="top"
			className="shadow-sm"
			style={{ zIndex: 1000 }}
		>
			<Container className="flex justify-between align-center">
				<Link
					to="/"
					className="navbar-brand d-flex align-items-center gap-2"
				>
					<img
						src={Logo}
						alt="Logo"
						style={{ height: "48px", width: "48px" }}
						className="rounded-lg "
					/>
					<span className="fw-semibold fs-5">ChatterBox</span>
				</Link>

				{user ? (
					<Nav className="d-flex align-items-center gap-3">
						<NavItem
							className="position-relative"
							title={`You have ${newMessageRecieved.length} new notifications`}
							onClick={() => dispatch(setNotificationBox(true))}
							style={{ cursor: "pointer" }}
						>
							<MdNotificationsActive size={22} />
							{newMessageRecieved.length > 0 && (
								<span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
									{newMessageRecieved.length}
								</span>
							)}
						</NavItem>

						<Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
							<DropdownToggle
								tag="div"
								className="d-flex align-items-center gap-2 text-white"
								style={{ cursor: "pointer" }}
							>
								<img
									src={user.image}
									alt="User"
									className="rounded-circle"
									style={{ height: "36px", width: "36px" }}
								/>
								<span className="fw-medium">{user.firstName}</span>
								{dropdownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
							</DropdownToggle>

							<DropdownMenu
								end
								style={{
									minWidth: "180px", // wider menu
									marginTop: "0.5rem", // spacing from toggle
									right: 0, // align right
								}}
							>
								<DropdownItem onClick={() => dispatch(setProfileDetail())} className="flex flex-row items-center">
									<PiUserCircleLight size={16} className="me-2" />
									Profile
								</DropdownItem>
								<DropdownItem onClick={handleLogout} className="flex flex-row items-center">
									<IoLogOutOutline size={16} className="me-2" />
									Logout
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>

					</Nav>
				) : (
					<Link to="/signin">
						<Button color="light" size="sm">
							Sign In
						</Button>
					</Link>
				)}
			</Container>
		</Navbar>
	);
};

export default Header;
