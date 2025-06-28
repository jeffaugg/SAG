import { Breadcrumb, Space } from "antd";
import { Link } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationContext";

const AppBreadcrumb = () => {
    const { breadcrumbs } = useNavigation();

    if (breadcrumbs.length <= 1) return null;

    return (
        <Breadcrumb className="mb-4 w-full flex justify-start">
            {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                const content = (
                    <Space size={4}>
                        <span>{item.label}</span>
                    </Space>
                );

                return (
                    <Breadcrumb.Item key={item.path}>
                        {isLast ? (
                            content
                        ) : (
                            <Link to={item.path}>{content}</Link>
                        )}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export default AppBreadcrumb;
