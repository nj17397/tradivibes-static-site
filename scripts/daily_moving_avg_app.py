import pandas as pd
import yfinance as yf
from datetime import datetime
import sys

# Define the file paths
#input_file_path = '/Users/anupjee/Documents/projects/moving_avg/data/symbol_list_20240817.csv'
#input_file_path = '/Users/anupjee/Documents/projects/moving_avg/data/symbol_list_20241110.csv'
#input_file_path= '/Users/anupjee/Documents/projects/moving_avg/data/symbol_list_20250621.csv'
#output_file_path_template = '/Users/anupjee/Documents/projects/moving_avg/data/stock_to_buy_{}_upd.csv'
input_file_path=sys.argv[1]
output_file_path_template=sys.argv[2]+'/stock.csv'

# Read the CSV file to create a symbol list
df_symbols = pd.read_csv(input_file_path)
symbol_list = df_symbols['Symbol'].tolist()

# Initialize an empty DataFrame to store the data of stocks to buy
stocks_to_buy_df = pd.DataFrame()

# Get the current date in 'yyyy-mm-dd' format
current_date = datetime.now().strftime('%Y-%m-%d')
#current_date='2025-06-20'

# Iterate through the symbol list
for symbol in symbol_list:
    # Append '.NS' to the symbol to indicate NSE stocks
    ticker_symbol = symbol + '.NS'
    print("Processing ticker ----> {0}".format(symbol))
    
    try:
        # Fetch historical market data for the past 1 month to ensure we get at least 10 trading days
        ticker_data = yf.Ticker(ticker_symbol)
        historical_data = ticker_data.history(period="1mo")
        
        # Calculate the 5-day moving average
        historical_data['9-day MA'] = historical_data['Close'].rolling(window=9).mean()
        historical_data['9-day_MV'] = historical_data['Volume'].shift(1).rolling(window=9).mean()
        historical_data['MONTH_MIN'] = (historical_data['Close']).min()
        #print(historical_data)
        #sys.exit(0)

        
        # Check if the current date's closing price is crossing the 9-day moving average in a positive manner
        if current_date in historical_data.index:
            today_data = historical_data.loc[[current_date]].copy()  # Ensure to make a copy to avoid SettingWithCopyWarning
            today_data.reset_index(drop=True, inplace=True)  # Reset index after selection
            if today_data.at[0, 'Close'] > today_data.at[0, '9-day MA'] and \
               historical_data['Close'].shift(1).loc[current_date] <= historical_data['9-day MA'].shift(1).loc[current_date] and \
                historical_data['Close'].shift(2).loc[current_date] <= historical_data['9-day MA'].shift(2).loc[current_date] and \
                    historical_data['Close'].shift(3).loc[current_date] <= historical_data['9-day MA'].shift(3).loc[current_date]:
                # Calculate the percent change
                print("here----------")
                today_data['Percent Change'] = ((today_data.at[0, 'Close'] - today_data.at[0, 'Open']) / today_data.at[0, 'Open']) * 100
                today_data['Percent vol Change'] = ((today_data.at[0, 'Volume'] - today_data.at[0, '9-day_MV']) / today_data.at[0, '9-day_MV']) * 100
                
                # Add 'Symbol' column
                today_data['Symbol'] = symbol
                
                # Concatenate the new row to the DataFrame
                stocks_to_buy_df = pd.concat([stocks_to_buy_df, today_data], ignore_index=True)
    except Exception as e:
        print(f"Error processing {ticker_symbol}: {e}")

#Filtering data on the basis of avg volume and price changes
stocks_to_buy_df=stocks_to_buy_df[(stocks_to_buy_df['Percent Change'] > 0 ) & (stocks_to_buy_df['Percent vol Change'] > 0)]

# Remove columns 'Dividends' and 'Stock Splits' if they exist
columns_to_remove = ['Dividends', 'Stock Splits','MONTH_MIN','9-day_MV','9-day_MV']
stocks_to_buy_df.drop(columns=[col for col in columns_to_remove if col in stocks_to_buy_df.columns], inplace=True)
stocks_to_buy_df['Process_date'] = pd.Timestamp(datetime.now().date())

# Reorder columns to have 'Symbol' as the first column
if not stocks_to_buy_df.empty:
    cols = stocks_to_buy_df.columns.tolist()
    cols = ['Symbol'] + [col for col in cols if col != 'Symbol']
    stocks_to_buy_df1 = stocks_to_buy_df[cols]

# Get the current date in 'yyyymmdd' format for the output filename
current_date_filename = datetime.now().strftime('%Y%m%d')

# Define the output file path with the current date
output_file_path = output_file_path_template.format(current_date_filename)

# Save the appended DataFrame to a new CSV file
sorted_stocks_to_buy_df_desc = stocks_to_buy_df1.sort_values(by='Percent vol Change', ascending=False)
sorted_stocks_to_buy_df_desc.to_csv(output_file_path, index=False)

print(f"Stock to buy list has been saved to {output_file_path}")
