import {useNyitottVerseny, useUszoversenyekList} from "../../uszoversenyek/hooks";
import {useCsapatokList} from "../../csapatok/hooks";
import {useMemo} from "react";
import {LoadingView, LoadingViewContent} from "../../utils/components/loading";
import {OrganisationContext} from "../index";
import {Outlet} from "react-router-dom";

export function OrganisationRouteProvider() {
    const [uszoversenyek, loadingUszoversenyek] = useUszoversenyekList();
    const [nyitott, loadingNyitott] = useNyitottVerseny();
    const [csapatok, loadingCsapatok] = useCsapatokList();

    const loading = useMemo(() => {
        return loadingUszoversenyek || loadingNyitott || loadingCsapatok;
    }, [loadingCsapatok, loadingNyitott, loadingUszoversenyek]);

    return (
        <LoadingView condition={loading}>
            <LoadingViewContent>
                <OrganisationContext.Provider value={{
                    uszoversenyek, csapatok, nyitottUszoverseny: nyitott,
                    refresh(): void {
                        window.location.reload();
                    }
                }}>
                    <Outlet/>
                </OrganisationContext.Provider>
            </LoadingViewContent>
        </LoadingView>
    );
}
