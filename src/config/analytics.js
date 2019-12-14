import ReactGa from 'react-ga'

export const initGA = ()=>{
    ReactGa.initialize('UA-154444060-1')
}

export const logPageView = ()=>{
    ReactGa.set({page: window.location.pathname})
    ReactGa.pageview(window.location.pathname + window.location.search)
}

export const logEvent = (category, action, keyword)=>{
    ReactGa.event({
        category: category,
        action: action,
        label: keyword
    })
}