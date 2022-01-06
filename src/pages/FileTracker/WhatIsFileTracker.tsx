import MainLayout from "../../components/layout/MainLayout"

export const WhatIsFileTracker = (): JSX.Element => {
    return (
        <MainLayout>
            <div className="mt-24">
                <h1 className="text-3xl font-bold p-6">What is File Tracker?</h1>
                <div className="p-6 grid gap-6 leading-8 tracking-wide">
                    <p>
                        FileTracker is an electronic filing system that could be used by anyone to save,  manage, share and organise their files based on a certain criteria. FileTracker could be seen as a file storage with additional functionalities like  sorting, searching and allowing file share between users.
                    </p>


                    <p>
                        The application will reduce the time spent on managing and maintaining paper  documents, storage space required for paper documents, delay in retrieval of  paper documents and the risks of loss of documents due to physical damage.
                        Files could be uploaded, downloaded and shared among other users.  Unauthourised users and users that have their permission restricted will not be  able to use certain functionalities of the application.
                    </p>

                    <p>
                        Using FileTracker will save the end users physical storage space, resources  needed to organise, file and store paper documents. It could also permanently  preserve documents from physical damage.
                    </p>
                </div>
            </div>
        </MainLayout>
    )
}