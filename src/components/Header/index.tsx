import React, {useState, useEffect} from 'react';
import {isMobile} from 'react-device-detect';
import {Text} from 'rebass';

import styled from 'styled-components';

import Logo from '../../assets/svg/logo.svg';
import LogoDark from '../../assets/svg/logo_white.svg';
import Wordmark from '../../assets/svg/wordmark.svg';
import WordmarkDark from '../../assets/svg/wordmark_white.svg';
import {useDarkModeManager} from '../../state/user/hooks';
import {useETHBalances} from '../../state/wallet/hooks';

import {YellowCard} from '../Card';
import Settings from '../Settings';
//import Menu from '../Menu'

import Row, {RowBetween} from '../Row';
import Web3Status from '../Web3Status';
//import VersionSwitch from './VersionSwitch'

import {useActiveHmyReact} from '../../hooks';
import Modal from '../ModalBridge';
import {ExchangeBlock,  mainnet as mainnetConfig, testnet as testnetConfig, BridgeSDK} from 'bridge-ui-sdk';

import { useMetaMaskAccount} from '../../bridge/ETHWallet/hooks';
import 'bridge-ui-sdk/dist/index.css'
import {useAllTokens} from '../../hooks/Tokens';

const {ChainID} = require('@harmony-js/utils');

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({theme}) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`;

const Link = styled.span`
  span, a, a:visited {
  text-decoration: none;
  cursor: pointer;
  outline: none;
  ${({theme}) => `color: ${theme.primaryText1}`};
  }
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({theme}) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`;

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({theme}) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const AccountElement = styled.div<{active: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({theme, active}) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`;

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`;

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`;

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
  ${({theme}) => theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `};
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({theme}) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`;

const BalanceText = styled(Text)`
  ${({theme}) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const NETWORK_LABELS: { [chainId in typeof ChainID]: string | null } = {
  [ChainID.HmyMainnet]: null,
  [ChainID.HmyTestnet]: null,

  [ChainID.Default]: null,
  [ChainID.EthMainnet]: null,
  [ChainID.Morden]: null,
  [ChainID.Ropsten]: null,
  [ChainID.Rinkeby]: null,
  [ChainID.RootstockMainnet]: null,
  [ChainID.RootstockTestnet]: null,
  [ChainID.Kovan]: null,
  [ChainID.EtcMainnet]: null,
  [ChainID.EtcTestnet]: null,
  [ChainID.Geth]: null,
  [ChainID.Ganache]: null,
  [ChainID.HmyLocal]: null,
  [ChainID.HmyPangaea]: null,
};

export default function Header() {
  const {account, chainId} = useActiveHmyReact();
  const [showBridge, setShowBridge] = useState(false);
  const ETHAccount = useMetaMaskAccount();
  //const ETHBalances = useAllEthereumBalances(ETHAccount);
  // console.log({account})

  const bridgeChain = chainId === 1 ? 'mainnet' : 'testnet'

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const HRC20Tokens = Object.keys(useAllTokens())
  const [bridgeTokenList, setBridgeTokenList] = useState<any[]>([])

  useEffect(() => {
    try {
      const bridgeSdk = new BridgeSDK({ logLevel: 0 })
      const config = chainId === 1 ? mainnetConfig : testnetConfig
      bridgeSdk.init(config).then(() => {
        bridgeSdk.api
          .getTokensInfo({ page: 0, size: 1000 })
          .then((res) => setBridgeTokenList(res.content))
      })
    } catch (e) {
    }
  }, [chainId])

  const customTokens: any[] = bridgeTokenList.filter(({hrc20Address}) =>  HRC20Tokens.includes(hrc20Address))

  const [isDark] = useDarkModeManager();

  return (
    <>
      <HeaderFrame>
        <RowBetween style={{alignItems: 'flex-start'}} padding="1rem 1rem 0 1rem">
          <HeaderElement>
            <Title href=".">
              <UniIcon>
                <img src={isDark ? LogoDark : Logo} alt="logo" />
              </UniIcon>
              <TitleText>
                <img height="16" style={{marginLeft: '4px', marginTop: '-4px'}} src={isDark ? WordmarkDark : Wordmark}
                     alt="logo" />
              </TitleText>
            </Title>
            <HeaderElement>
            <Link>
              <span onClick={()=>setShowBridge(!showBridge)}>Bridge</span>
            </Link>
            </HeaderElement>
           {/* <HeaderElement>
              <Link>
              <a style={{marginLeft: '10px'}}
                rel="noopener noreferrer" target="_blank"
                 href="https://tvl.swoop.exchange">Pools</a>
              </Link>
            </HeaderElement>*/}
          </HeaderElement>
          <HeaderControls>
            <HeaderElement>
              <TestnetWrapper>
                {!isMobile && chainId && NETWORK_LABELS[chainId] &&
                <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
              </TestnetWrapper>
              <AccountElement active={!!account} style={{pointerEvents: 'auto', backgroundColor: 'inherit'}}>
                {account && userEthBalance ? (
                  <BalanceText style={{flexShrink: 0}} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                    {userEthBalance?.toSignificant(6)} ONE
                  </BalanceText>
                ) : null}
                <Web3Status />
              </AccountElement>
            </HeaderElement>
            <HeaderElementWrap>
              {/* <VersionSwitch /> */}
              <Settings />
              {/* <Menu /> */}
            </HeaderElementWrap>
          </HeaderControls>
        </RowBetween>
      </HeaderFrame>

      <Modal isOpen={showBridge} onDismiss={()=>setShowBridge(false)} width={560}>
        <div style={{width: '100%', padding: '15px'}}>
         Harmony Bridge. The stand-alone version is available&nbsp;
          <Link>
            <a rel="noopener noreferrer" target="_blank" href="https://bridge.harmony.one/">here</a>
          </Link>
        </div>
        <ExchangeBlock tokens={customTokens} addressOneWallet={account} network={bridgeChain} addressMetamask={ETHAccount}/>
      </Modal>
    </>
  );
}
