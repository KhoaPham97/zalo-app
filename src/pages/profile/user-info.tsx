import { UserInfoSkeleton } from "@/components/skeleton";
import TransitionLink from "@/components/transition-link";
import { loadableUserInfoState, userInfoKeyState } from "@/state";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { authorize } from "zmp-sdk";
import { Icon } from "zmp-ui";

function UserInfo() {
  const userInfo = useAtomValue(loadableUserInfoState);
  const setInfoKey = useSetAtom(userInfoKeyState);
  const refreshPermissions = () => setInfoKey((key) => key + 1);
  useEffect(() => {
    if (userInfo.state == "hasData" && !userInfo.data) {
      authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      }).then(refreshPermissions);
    }
  }, [userInfo]);

  if (userInfo.state === "hasData" && userInfo.data) {
    const { name, avatar, phone } = userInfo.data;
    return (
      <div className="bg-section rounded-lg p-4 flex items-center space-x-4 border-[0.5px] border-black/15">
        <img className="rounded-full h-10 w-10" src={avatar} />
        <div className="space-y-0.5 flex-1 overflow-hidden">
          <div className="text-lg truncate">{name}</div>
          <div className="text-sm text-subtitle truncate">{phone}</div>
        </div>
        {/* <TransitionLink to="/profile/edit">
          <Icon icon="zi-edit-text" />
        </TransitionLink> */}
      </div>
    );
  }

  return <UserInfoSkeleton />;
}

export default UserInfo;
