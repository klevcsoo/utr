import {Outlet, useParams} from "react-router-dom";
import {useVersenyszamDetails} from "../hooks";
import {useNevezesekList} from "../../nevezesek/hooks";
import {useMemo} from "react";
import {LoadingView, LoadingViewContent} from "../../utils/components/loading";
import {LoadingViewError} from "../../utils/components/loading/LoadingViewError";
import {NotFoundLayout} from "../../utils/components/NotFoundLayout";
import {VersenyszamContext} from "../index";

export function VersenyszamRouteProvider() {
    const {versenyszamId: id} = useParams();

    const [vszam, loadingVszam] = useVersenyszamDetails(parseInt(id!));
    const [nevezesek, loadingNevezesek] = useNevezesekList(parseInt(id!));

    const loading = useMemo(() => {
        return loadingVszam || loadingNevezesek;
    }, [loadingNevezesek, loadingVszam]);

    return (
        <LoadingView condition={loading}>
            <LoadingViewError condition={!vszam}>
                <NotFoundLayout/>
            </LoadingViewError>
            <LoadingViewContent>
                <VersenyszamContext.Provider value={{
                    versenyszam: vszam!, nevezesek,
                    refresh(): void {
                        window.location.reload();
                    }
                }}>
                    <Outlet/>
                </VersenyszamContext.Provider>
            </LoadingViewContent>
        </LoadingView>
    );
}
