import { createFromIconfontCN } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { Badge, Card, Tabs } from "antd"
import ItemRemind from "./components/ItemRemind";
import ItemMessage from "./components/itemMessage";
import ItemBulletin from "./components/ItemBulletin";
import { useLocation, useRequest } from 'umi';
import { useEffect, useState } from "react";
import { queryUnreadBulletinCount, queryUnreadMessageCount, queryUnreadRemindCount } from "@/services/api/notify/notify";

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3600666_tna8rkswqdf.js',
});

const NoticeIndex: React.FC = () => {
    const location = useLocation();
    const [activeKey, setActiveKey] = useState<string>("0");
    const { data: unreadRemindCount, loading: unreadRemindCountLoading } = useRequest(queryUnreadRemindCount);
    const { data: unreadMessageCount, loading: unreadRemindMessageLoading } = useRequest(queryUnreadMessageCount);
    const { data: unreadBulletinCount, loading: unreadBulletinCountLoading } = useRequest(queryUnreadBulletinCount);
    const items = [
        {
            label: (<span>
                <Badge count={unreadRemindCountLoading ? 0 : unreadRemindCount} dot offset={[-10, 0]}><IconFont type="icon-tixing" /></Badge>
                提醒
            </span>),
            key: 'remind',
            children: <ItemRemind />
        },
        {
            label: (<span>
                <Badge count={unreadRemindMessageLoading ? 0 : unreadMessageCount} dot offset={[-10, 0]}><IconFont type="icon-JC_059" /></Badge>
                私信
            </span>),
            key: 'message',
            children: <ItemMessage />
        },
        {
            label: (<span>
                <Badge count={unreadBulletinCountLoading ? 0 : unreadBulletinCount} dot offset={[-10, 0]}><IconFont type="icon-gonggao" /></Badge>
                公告
            </span>),
            key: 'bulletin',
            children: <ItemBulletin />
        },
    ];

    useEffect(() => {
        setActiveKey(location.query.type)
    }, [location.query.type]);
    return (
        <PageContainer>
            <Card>
                <Tabs
                    defaultActiveKey={location.query.type}
                    activeKey={activeKey}
                    onChange={(activeKey) => {
                        setActiveKey(activeKey)
                    }}
                    centered
                    tabPosition="left"
                    items={items} />
            </Card>
        </PageContainer>
    )
}
export default NoticeIndex;