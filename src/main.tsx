import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store , persistor} from "../api/store/store.ts";
import {PersistGate} from "redux-persist/integration/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <PersistGate
              loading={
                  <div className="flex h-screen justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
              }
              persistor={persistor}
          >
              <App />


          </PersistGate>
      </Provider>
  </StrictMode>,
)
