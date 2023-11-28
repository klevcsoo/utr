import {Link, useLocation} from "react-router-dom";
import {useCallback, useMemo} from "react";
import {Breadcrumbs} from "@material-tailwind/react";
import {HomeIcon} from "@heroicons/react/24/solid";

import {useTranslation} from "../../translations/hooks";

export function AdminBreadcrumbs() {
    const t = useTranslation();

    const {pathname} = useLocation();

    const pathSegments = useMemo(() => {
        return pathname.split("/").filter(value => !!value);
    }, [pathname]);

    const name = useCallback((path: string) => {
        return t(`breadcrumbs.${path}`);
    }, [t]);

    return (
        <div className="w-full bg-blue-gray-50 bg-opacity-50 rounded-lg">
            <Breadcrumbs fullWidth className="bg-transparent h-9">
                {pathSegments.map((value, i) => (
                    <Link to={`/${pathSegments.slice(0, i + 1).join("/")}`}
                          className="opacity-60 last:opacity-100"
                          key={i}>
                        {value === "admin" ? <HomeIcon className="h-4"/> :
                            isNaN(parseInt(value)) ? name(value) : value
                        }
                    </Link>
                ))}
            </Breadcrumbs>
        </div>
    );
}
