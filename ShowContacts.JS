import { LightningElement , api, wire , track} from 'lwc';
import getListOfCon from '@salesforce/apex/ContactsDMLController.getListOfCon';
import {updateRecord} from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';	
import { refreshApex } from '@salesforce/apex';

export default class ShowContacts extends LightningElement {

    @api listOfContacts;
    @track lstOfCon = [];
    //contacts;
    connectedCallback(){
        console.log('listOfContacts === '+JSON.stringify(this.listOfContacts));
    }
    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Renewal Date', fieldName: 'Renewal_Date__c', type: 'date-local' ,timeZone: 'UTC-5' , editable : true},
        // Add more columns as needed
    ];
    draftValues = [];

    handleSave(event){
        console.log('listOfContacts ==='+JSON.stringify(this.listOfContacts));
        this.saveDraftValues = event.detail.draftValues;
        console.log('recordinput == '+JSON.stringify(this.saveDraftValues));
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return {fields};
        });
        console.log('recordinput == '+JSON.stringify(recordInputs));
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));

        Promise.all(promises).then(res => {
            this.ShowToast('Success','Records updated', 'success', 'dismissable');
            this.saveDraftValues = [];
            return this.refresh();
        }).catch(error =>{
            this.ShowToast('Error ', 'An error occurred', 'error', 'dismissable');
        }).finally(() => {
            this.saveDraftValues = [];
        });
    }

    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
        
    }

    async refresh(){
        await refreshApex(this.listOfContacts);
    }

    /*@wire(getListOfCon, { contacts: '$listOfContacts' })
    wiredContacts(result) {
        //this.lstOfCon = result;
        
        if (result.data) {
            this.lstOfCon = result.data;
            console.log('resutl --- '+JSON.stringify(this.lstOfCon));
        } else if (result.error) {
            console.error('Error fetching contacts:', result.error);
        }
    }
    
    updateContactEmail() {

        updateContactEmail1({contacts: this.listOfContacts})
            .then(result => {
                 this.lstOfCon = result;
            })

    }*/
}
