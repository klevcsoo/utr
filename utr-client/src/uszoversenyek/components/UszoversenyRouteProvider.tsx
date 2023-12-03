import {Outlet, useParams} from "react-router-dom";
import {useVersenyszamokList} from "../../versenyszamok/hooks";
import {useUszoversenyDetails} from "../hooks";
import {useMemo} from "react";
import {LoadingView, LoadingViewContent} from "../../utils/components/loading";
import {LoadingViewError} from "../../utils/components/loading/LoadingViewError";
import {NotFoundLayout} from "../../utils/components/NotFoundLayout";
import {UszoversenyContext} from "../index";

export function UszoversenyRouteProvider() {
    const {uszoversenyId: id} = useParams();

    const [verseny, loadingVerseny] = useUszoversenyDetails(parseInt(id!));
    const [versenyszamok, loadingVersenyszamok] = useVersenyszamokList(
        parseInt(id!)
    );

    const loading = useMemo(() => {
        return loadingVerseny || loadingVersenyszamok;
    }, [loadingVerseny, loadingVersenyszamok]);

    return (
        <LoadingView condition={loading}>
            <LoadingViewError condition={!verseny}>
                <NotFoundLayout/>
            </LoadingViewError>
            <LoadingViewContent>
                <UszoversenyContext.Provider value={{
                    uszoverseny: verseny!, versenyszamok,
                    refresh(): void {
                        window.location.reload();
                    }
                }}>
                    <Outlet/>
                </UszoversenyContext.Provider>
            </LoadingViewContent>
        </LoadingView>
    );
}
