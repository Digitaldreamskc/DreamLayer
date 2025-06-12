export default function EmergencyTest() {
  console.log('Component is rendering')
  
  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'red', 
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        EMERGENCY TEST - IF YOU SEE THIS, REACT IS WORKING
      </div>
    </>
  )
}
