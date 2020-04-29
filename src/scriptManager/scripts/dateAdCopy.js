const options = {
    id: 3,
    name: 'CTR Magnet - Date in AdCopy',
    version: '1.0.1',
    platform: 'Google Ads',
    type: 'Script', 
    setupInstructions:`/* 

    Dynamically Insert Today's Date, Day, Month, Year etc into adcopy using {=Date. ...}
    
    Setup: 
    1. Change offsetHour to the difference between your timezone and GMT - 7. 
    Eg If you're in Central European Time (GMT+2), set offsetHour to 9. If you're in -9, set offsetHour to -2.
    
    2: Set script to run Daily at 00:00
    
    3: Run script once to create data feed. (Check Business Data > Data Feeds > Date)
    
    Author: Doug Silkstone - doug@withseismic.com
    Codealong: https://www.twitch.tv/videos/599249260
    
    */`
  }
  
  const getScriptContent = () => {
    return `function main() {

        var offsetHour = 9  // EDIT THIS - SEE SETUP INSTRUCTIONS
        
        var dataFeed = grabDataSource('Date-newdate')
        var dateOptions = calcDate(offsetHour)
         
        
        if (dataFeed.items().get().totalNumEntities() === 0) {  
          
          Logger.log('Creating a new item in empty data feed')
          dataFeed.adCustomizerItemBuilder().withAttributeValues(dateOptions).build()   
        } else {
          
          var currentDataFeed = dataFeed.items().get().next()
          Logger.log('Updating Feed values from current date')  
          currentDataFeed.setAttributeValues(dateOptions)
          
        }
        
        
        Logger.log('Script Finished, Dates Updated')
        
      }
      
      
      function calcDate(offset) {
       
        var now = new Date()
       var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
       var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ]
        
        // We need to correct our time
       
      
        
       Logger.log('Is this time correct? %s (%s)? If not, refer to the setup guide for a quick fix!',  AdWordsApp.currentAccount().getTimeZone(), Utilities.formatDate(now,  AdWordsApp.currentAccount().getTimeZone(), "HH:mm:ss"))
        
        var today = Utilities.formatDate(now, AdWordsApp.currentAccount().getTimeZone(), "MMMM dd, yyyy HH:mm:ss Z")
        if (typeof timeCorrection == 'undefined') {     
          today = new Date(now.setHours(now.getHours() + offset ))
        }  
          
        
        return {
          today: today.toLocaleDateString(), // Wednesday 22nd April 2020
          day: days[today.getDay()], 
          ordinal: getOrdinal(today.getDate()), // 1st, 2nd, 3rd.. 
          month: months[today.getMonth()],
          date: today.getDate().toString(), 
          year: today.getFullYear().toString()
        } 
        
      }
      
      function getOrdinal(date) {
       
      if (date > 3 && date < 21) return date + 'th'
        
        switch (date % 10)  
        {
          case 1:
            return date + 'st'
            
          case 2:
            return date + 'nd'
            
          case 3:
            return date + 'rd'
            
            
          default:
            return date + 'th'
              
        } 
        
      }
      
      
      function grabDataSource(name) {
       
         var sources = AdWordsApp.adCustomizerSources().get()
         
         while (sources.hasNext()) {
           var source = sources.next()
           if (source.getName() === name) {
            
             Logger.log('Found Data Feed Source: %s', source.getName())
             return source
          
           }
              
         }
        
        Logger.log('No source found: creating new source %s', name)
        return AdWordsApp.newAdCustomizerSourceBuilder()
        .withName(name)
        .addAttributes({
          today: 'text',
          day: 'text',
          ordinal: 'text',
          month: 'text',
          date: 'text',
          year: 'text'
        })
        .build()
        .getResult()
        
      
      }
      `
  }
  
  module.exports = {
    ...options,
    getScriptContent
  }
  