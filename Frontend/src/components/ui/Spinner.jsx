import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// 1. Explicitly add the .json extension to the import line
import bookAnimationData from "../../assets/Flip-Book-Loader.json"

const Spinner = () => {
  return (
    <div style={styles.overlay}>
      <div style={{ width: '250px', height: '250px' }}>
        <DotLottieReact
          // 2. Change 'src' to 'data' and pass the JSON variable directly
          data={bookAnimationData}
          loop
          autoplay
        />
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh',
    backgroundColor: '#ffffff', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999
  }
};

export default Spinner
