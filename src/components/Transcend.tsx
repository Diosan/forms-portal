import Add from "./Add";
import List from "./List";
import { Provider } from "react-redux"
import { store } from "../store/store"

const Transcend = () => {
    return (
        <Provider store={store}>
            <div>
                <Add />
                <List />
            </div>
        </Provider>
    )
}

export default Transcend