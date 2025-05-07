import React, { useState, useEffect } from 'react'
import img from '../../../Assets/Images/ai.gif'
import { ArrowRight, Clock, Clock1, Info, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Businessdetails from './Businessdetails'
import Fundingrequirement from './Fundingrequirement'
import Growthplan from './Growthplan'
import Pitchready from './Pitchready'
import { Cancel, CancelRounded } from '@mui/icons-material'
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react'
import CustomButton from '../../../Utiles/CustomButton'

const Pitchdeckcreation = () => {
    const [pitchDeck, setPitchDeck] = useState(true)
    const [businessDetails, setBusinessDetails] = useState(false)
    const [fundingRequirement, setFundingRequirement] = useState(false)
    const [growthPlan, setGrowthPlan] = useState(false)
    const [yourPitchDeck, setYourPitchDeck] = useState(false)
    const [popup , setPopup] = useState(false);

    const handlePitchDeck = () => {
        setPopup(true)
        // setPitchDeck(false)
        // setBusinessDetails(true)
    }
    const handleBusinessDetails = () =>{
        setBusinessDetails(false)
        setFundingRequirement(true)
    }
    const backFundingRequirement = () => {
        setFundingRequirement(false)
        setBusinessDetails(true)
    }
    const nextFundingRequirement = () => {
        setFundingRequirement(false)
        setGrowthPlan(true)
    }
    const backGrowthPlan = () => {
        setGrowthPlan(false)
        setFundingRequirement(true)
    }
    const nextGrowthPlan = () => {
        setGrowthPlan(false)
        setYourPitchDeck(true)
    }



    return (
      <>
        {pitchDeck && (
          <div className="bg-white rounded-xl p-5">
            <h1 className="text-3xl font-semibold text-[#05004E]">
              AI-Assisted Pitch Deck Creation
            </h1>
            <div className="flex flex-col justify-center place-items-center  mt-14">
              <h1 className="Agbalumo text-5xl">
                Welcome to the <span className="text-[#4A3AFF]">Pitch</span>
              </h1>
              <h1 className="Agbalumo text-5xl">
                <span className="text-[#4A3AFF]">Deck </span>Creator!
              </h1>
              <span className="text-xs w-1/5 text-center mt-5 text-[#979797]">
                Our AI-powered assistant will guide you through a series of
                questions to help you build a professional and investor-ready
                pitch deck. Simply provide details about your business, and
                we'll handle the rest
              </span>
              <img src={img} alt="" className="w-2/5 h-2/5" />
              <span className="mt-3 font-medium">
                Ready to create your winning pitch deck?{' '}
              </span>

              <button
                onClick={handlePitchDeck}
                className="px-24 mt-2 py-3 bg-[#4A3AFF] hover:scale-105 font-semibold transition-transform transform flex place-items-center gap-3 flex-row rounded-full text-white"
              >
                Let’s get started <ArrowRight />
              </button>
            </div>
          </div>
        )}

        {businessDetails && (
          <Businessdetails handleBusinessDetails={handleBusinessDetails} />
        )}

        {fundingRequirement && (
          <Fundingrequirement
            backFundingRequirement={backFundingRequirement}
            nextFundingRequirement={nextFundingRequirement}
          />
        )}

        {growthPlan && (
          <Growthplan
            backGrowthPlan={backGrowthPlan}
            nextGrowthPlan={nextGrowthPlan}
          />
        )}

        {yourPitchDeck && <Pitchready />}

        <Modal show={popup} size="md" onClose={() => setPopup(false)} popup>
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <Clock className="mx-auto mb-2 h-14 w-14 text-[#4A3AFF] dark:text-gray-200" />
              <p className="text-[0.9rem] text-gray-600 mb-3  gap-2">
            <span className=' font-semibold text-red-500'>Please note</span> this process may take up to 10 minutes to generate your AI-powered pitch deck
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-neutral-200 px-4 py-2 text-base rounded-md"
                  onClick={() => setPopup(!popup)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#4A3AFF] px-4 py-2 text-white rounded-md"
                  onClick={() => {
                    setPopup(false);
                    setPitchDeck(false);
                    setBusinessDetails(true);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
}

export default Pitchdeckcreation
