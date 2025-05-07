import { Datepicker, Modal } from 'flowbite-react';
import { Calendar1, Plus, Search } from 'lucide-react'
import React, { useState } from 'react'
import { format } from 'date-fns';
import { notify } from './Notification';

const Filter = ({ search, setSerch, to, setTo, from, setFrom, date }) => {

    const formatDate = (date) => (date ? format(date, 'MMM dd, yyyy') : '');
    const [openModal, setOpenModal] = useState(false);

    const fromDate = (date) => {
        if (to) {
            if (to < date) {
                setTo(null)
                setFrom(date)
            } else {
                setFrom(date)
            }
        } else {
            setFrom(date)
        }
    }


    const setDates = () => {
        if (!to) {
            notify('danger', 'Please Select To Date');
            return;
        }
        if (!from) {
            notify('danger', 'Please Select From Date');
            return;
        }
        setOpenModal(false)
    }

    const reset = () => {
        setTo(null)
        setFrom(null)
    }

    const close = () => {
        setTo(null);
        setFrom(null)
        setOpenModal(false)
    }

    return (
        <>
            <div className="flex flex-row gap-5 place-items-center mb-3">
                {search &&
                    <div className="flex flex-row place-items-center group gap-3 focus-within:border-[#3D32CC] rounded-lg border-black overflow-hidden border text-[#3D32CC] w-96">
                        <div className="ms-3 text-[#929292f1] focus-within:text-[#3D32CC]">
                            <Search />
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            className='border-0 focus:ring-0 w-full bg-transparent'
                            placeholder="Search ...."
                            value={search}
                            onChange={(e) => setSerch(e.target.value)}
                        />
                    </div>
                }
                {date &&
                    <div className="flex flex-row place-items-center gap-3 text-[#929292f1] focus-within:border-[#3D32CC] rounded-lg border-black border  px-2 py-2">
                        <button onClick={() => setOpenModal(true)} className='flex flex-row place-items-center gap-3 focus-within:text-[#3D32CC]'>
                            <Calendar1 />
                            <span className=' font-medium'>{from ? formatDate(from) : 'From'} - {to ? formatDate(to) : 'To'}</span>
                        </button>
                        {to &&
                            <button onClick={reset} className='rotate-45'><Plus /></button>
                        }
                    </div>
                }
            </div>
            <Modal className='z-30' show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Date </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-row gap-5">
                        <div>
                            <label className="block font-medium mb-2">From : {formatDate(from)}</label>
                            <Datepicker
                                selected={from}
                                onChange={(date) => fromDate(date)}
                                selectsStart
                                startDate={from}
                                endDate={to}
                                dateFormat="dd/MM/yyyy"
                                inline
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-2">To : {formatDate(to)}</label>
                            <Datepicker
                                selected={to}
                                onChange={(date) => setTo(date)}
                                selectsEnd
                                startDate={from}
                                endDate={to}
                                minDate={from}
                                dateFormat="dd/MM/yyyy"
                                inline
                            />
                        </div>
                    </div>
                    <div className="mt-10 space-x-3">
                        <button className='shadow-xl px-4 py-2 rounded-xl  border font-medium' onClick={close}>Cancel</button>
                        <button className='shadow-xl px-4 py-2 rounded-xl bg-black text-white font-medium' onClick={setDates}>Done</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Filter