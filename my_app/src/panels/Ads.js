import React from 'react'
import PropTypes from 'prop-types'

import { Div, Button, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui'

import persik from '../img/persik.png'
import './Persik.css'

const Persik = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to="home"/>}
		>
			Поддержите проект
		</PanelHeader>
		<img className="Persik" src={persik} alt="Persik The Cat"/>
	<Div>
			<Button 
				 stretched size="l"
				 mode="secondary" 
				 onClick={()=>
				{
                  props.bridge.send ("VKWebAppShowNativeAds",
				  {"ad_format": "reward"})
				}} >
					Посмотрите видео
			</Button>
	</Div>

	</Panel>

)

Persik.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
}

export default Persik
