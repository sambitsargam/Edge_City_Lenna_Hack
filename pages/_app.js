import {useEffect} from 'react'
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {wrapper} from '../redux/store'
import { useDispatch } from 'react-redux';
import { getAllFunding, loadAccount, loadCrowdFundingContract, loadWeb3, subscribeCrowdFundingEvents } from '../redux/interactions';
import { Router } from 'next/router';
import NProgress from 'nprogress'
import "nprogress/nprogress.css";
import { chainOrAccountChangedHandler } from '../helper/helper';
import Head from "next/head";

function MyApp({ Component, pageProps }) {

  const dispatch = useDispatch()

  useEffect(() => {
    loadBlockchain()
  }, [])// eslint-disable-line react-hooks/exhaustive-deps
  

  const loadBlockchain = async() =>{
      const web3 = await loadWeb3(dispatch)
      const account = await loadAccount(web3,dispatch)
      const crowdFundingContract = await loadCrowdFundingContract(web3,dispatch)
      await getAllFunding(crowdFundingContract,web3,dispatch)
  }

  Router.events.on("routeChangeStart",()=> NProgress.start())
  Router.events.on("routeChangeComplete",()=> NProgress.done())
  Router.events.on("routeChangeError",()=> NProgress.done())
  
  useEffect(() => {
    // listen for account changes
    window.ethereum.on('accountsChanged', chainOrAccountChangedHandler);
    // Listen for chain change
    window.ethereum.on('chainChanged', chainOrAccountChangedHandler);
  }, [])
  
  
  return (
    <>
      <Head>
        <title>FundingHub</title>
      </Head>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}

export default wrapper.withRedux(MyApp)
