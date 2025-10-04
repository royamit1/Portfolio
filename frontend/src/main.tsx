import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ThemeProvider} from './hooks/useTheme.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
            <App/>
        </ThemeProvider>
    </StrictMode>,
)


// import {StrictMode} from 'react'
// import {createRoot} from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// // import { ThemeProvider } from "next-themes"
//
// createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//         {/*<ThemeProvider*/}
//         {/*    attribute="class"   // this adds 'class="dark"' or 'class="light"' to html*/}
//         {/*    defaultTheme="system"*/}
//         {/*    enableSystem*/}
//         {/*    disableTransitionOnChange*/}
//         {/*>*/}
//         <App/>
//         {/*</ThemeProvider>*/}
//     </StrictMode>,
// )