import React, { useState } from "react";
import MemberAdd from "./MemberAdd";
import MemberRemove from "./MemberRemove";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";

const Member = () => {
  const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
  const [memberAddBox, setMemberAddBox] = useState(false);

  return (
    <Container fluid className="pt-2 text-white position-relative h-100 overflow-auto bg-dark rounded p-3">
      <div className="fw-semibold text-center fs-5 mt-2">
        Members ({selectedChat?.users?.length})
      </div>
      {memberAddBox ? (
        <MemberAdd setMemberAddBox={setMemberAddBox} />
      ) : (
        <MemberRemove setMemberAddBox={setMemberAddBox} />
      )}
    </Container>
  );
};

export default Member;
