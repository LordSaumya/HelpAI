import { Button, ButtonGroup } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import React from 'react'

export default function App() {
  const [value, setValue] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleInputChange = (e) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }

  return (
    <>
      <div className='min-h-screen p-28 flex flex-col'>
        <Textarea
          value={value}
          onChange={handleInputChange}
          placeholder='Here is a sample placeholder'
          size='sm'
          resize={'none'}
          
        />
        <Button colorScheme='red' size='lg' isLoading={isLoading} padding={10} margin={10} marginX={20}>
          Start
        </Button>
        <Textarea
          value={value}
          onChange={handleInputChange}
          placeholder='Here is a sample placeholder'
          size='sm'
          resize={'none'}
          height={200}
        />
      </div>
    </>
  )
}