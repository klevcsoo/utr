import {useCsapatokList} from "../hooks/useCsapatokList";
import {DataTable} from "../components/tables/DataTable";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {Link} from "react-router-dom";

export function CsapatokOverviewPage() {
    const [csapatok, csapatokLoading] = useCsapatokList();

    return csapatokLoading ? (
        <div className="grid place-content-center h-screen">
            <LoadingSpinner/>
        </div>
    ) : (
        <div className="p-8 w-full flex flex-col gap-4 items-center">
            <h1 className="text-5xl w-full"><b>Csapatok</b></h1>
            <DataTable dataList={csapatok} propertyNameOverride={{
                nev: "név",
                varos: "város",
                id: "azonosító"
            }} excludedProperties={["id"]} actionColumn={entry => (
                <Link to={`/overview/csapatok/${entry.id}`}>
                    <button type="button" className="grid place-content-center
                    p-1 bg-slate-100 rounded-md hover:bg-blue-500 group">
                        <span className="material-symbols-rounded text-inherit
                        group-hover:text-white">
                            edit
                        </span>
                    </button>
                </Link>
            )}/>
        </div>
    );
}
