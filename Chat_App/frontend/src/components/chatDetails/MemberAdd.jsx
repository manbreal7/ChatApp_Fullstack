import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { setChatLoading, setLoading } from "../../redux/slices/conditionSlice";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { IoCheckmarkCircleOutline, IoPersonAddOutline } from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import { Button, Input, ListGroup, ListGroupItem, Spinner, Card, CardBody, Row, Col } from "reactstrap";

const MemberAdd = ({ setMemberAddBox }) => {
    const dispatch = useDispatch();
    const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inputUserName, setInputUserName] = useState("");
    const [addUserName, setAddUserName] = useState("");
    const [addUserId, setAddUserId] = useState("");

    useEffect(() => {
        const getAllUsers = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    setUsers(json.data || []);
                    setSelectedUsers(json.data || []);
                    dispatch(setChatLoading(false));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setChatLoading(false));
                });
        };
        getAllUsers();
    }, []);

    useEffect(() => {
        setSelectedUsers(
            users.filter((user) =>
                user.firstName.toLowerCase().includes(inputUserName.toLowerCase()) ||
                user.lastName.toLowerCase().includes(inputUserName.toLowerCase()) ||
                user.email.toLowerCase().includes(inputUserName.toLowerCase())
            )
        );
    }, [inputUserName]);

    const handleAddUser = (userId, userName) => {
        if (selectedChat?.users?.find((user) => user?._id === userId)) {
            toast.warn(`${userName} is already added`);
            return;
        }
        setAddUserId(userId);
        setAddUserName(userName);
    };

    const handleAddUserCall = () => {
        dispatch(setLoading(true));
        const token = localStorage.getItem("token");
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/groupadd`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: addUserId, chatId: selectedChat?._id }),
        })
            .then((res) => res.json())
            .then((json) => {
                toast.success(`${addUserName} Added successfully`);
                setAddUserId("");
                setAddUserName("");
                dispatch(addSelectedChat(json?.data));
                dispatch(setLoading(false));
                setMemberAddBox(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
                dispatch(setLoading(false));
            });
    };

    return (
        <Card className=" bg-warning p-3">
            <CardBody>
                <Row className="mb-3 align-items-center">
                    <Col>
                        <h5 className="text-center">Total Users ({users?.length || 0})</h5>
                    </Col>
                    <Col className="text-end">
                        <Button color="dark" onClick={() => setMemberAddBox(false)}>
                            <FaArrowLeft />
                        </Button>
                    </Col>
                </Row>
                <Input
                    type="text"
                    placeholder="Search Users..."
                    value={inputUserName}
                    onChange={(e) => setInputUserName(e.target.value)}
                />
                <ListGroup className="bg-danger mt-3">
                    {isChatLoading ? (
                        <Spinner color="primary" />
                    ) : selectedUsers.length > 0 ? (
                        selectedUsers.map((user) => (
                            <ListGroupItem key={user._id} className="bg-danger d-flex align-items-center">
                                <img src={user.image} alt="User" className="rounded-circle me-2" width="40" height="40" />
                                <span className="flex-grow-1">{user.firstName} {user.lastName}</span>
                                <Button color="primary" onClick={() => handleAddUser(user._id, user.firstName)}>
                                    <IoPersonAddOutline />
                                </Button>
                            </ListGroupItem>
                        ))
                    ) : (
                        <p className="text-center mt-2">No users registered.</p>
                    )}
                </ListGroup>
                {addUserName && (
                    <Row className="mt-3">
                        <Col>
                            <p>Confirm addition of '{addUserName}'?</p>
                        </Col>
                        <Col className="text-end">
                            <Button color="danger" onClick={() => { setAddUserName(""); setAddUserId(""); }}>
                                <VscError />
                            </Button>
                            <Button color="success" onClick={handleAddUserCall} className="ms-2">
                                <IoCheckmarkCircleOutline />
                            </Button>
                        </Col>
                    </Row>
                )}
            </CardBody>
        </Card>
    );
};

export default MemberAdd;
