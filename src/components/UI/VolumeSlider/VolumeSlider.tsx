import { FC, useState } from 'react'
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'
import WaveSurfer from 'wavesurfer.js'

interface IProps {
  waveSurfer: WaveSurfer | null
}

const VolumeSlider: FC<IProps> = ({ waveSurfer }) => {
  const [volume, setVolume] = useState(50)

  const trackStyle = {
    backgroundColor: '#FFC93F',
  }

  const handleStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  }

  const railStyle = {
    backgroundColor: '#54492e',
  }

  const handleSetVolume = (sliderVolume: number | number[]) => {
    if (typeof sliderVolume === 'number') {
      const newVolume = Number((sliderVolume / 100).toFixed(2))
      waveSurfer?.setVolume(newVolume)
      setVolume(newVolume * 100)
    }
  }

  return (
    <Slider
      min={0}
      max={100}
      vertical={true}
      trackStyle={trackStyle}
      handleStyle={handleStyle}
      railStyle={railStyle}
      value={volume}
      onChange={sliderVolume => handleSetVolume(sliderVolume)}
    />
  )
}

export default VolumeSlider
