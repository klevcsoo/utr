import {Outlet, useParams} from "react-router-dom";
import {useCsapatDetails} from "../hooks";
import {useUszokList} from "../../uszok/hooks";
import {useMemo} from "react";
import {LoadingView, LoadingViewContent} from "../../utils/components/loading";
import {CsapatContext} from "../index";
import {LoadingViewError} from "../../utils/components/loading/LoadingViewError";
import {NotFoundLayout} from "../../utils/components/NotFoundLayout";

export function CsapatRouteProvider() {
    const {csapatId: id} = useParams();

    const [csapat, loadingCsapat] = useCsapatDetails(!id ? undefined : parseInt(id));
    const [uszok, loadingUszok] = useUszokList(!id ? undefined : parseInt(id));

    const loading = useMemo(() => {
        return loadingCsapat || loadingUszok;
    }, [loadingCsapat, loadingUszok]);

    return (
        <LoadingView condition={loading}>
            <LoadingViewError condition={!csapat}>
                <NotFoundLayout/>
            </LoadingViewError>
            <LoadingViewContent>
                <CsapatContext.Provider value={{
                    csapat: csapat!, uszok,
                    refresh(): void {
                        window.location.reload();
                    }
                }}>
                    <Outlet/>
                </CsapatContext.Provider>
            </LoadingViewContent>
        </LoadingView>
    );
}
