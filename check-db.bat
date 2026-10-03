@echo off
echo ========================================================
echo Checking Expense Tracker Database (127.0.0.1:27017)
echo ========================================================
echo.

mongosh --quiet "mongodb://127.0.0.1:27017/expense_tracker" --eval "console.log('=== REGISTERED USERS ==='); console.log(db.users.find({}, {password: 0}).toArray()); console.log('\n=== ACTIVE OTPS ==='); console.log(db.registration_otps.find().toArray()); console.log('\n=== EXPENSES ==='); console.log(db.expenses.find().toArray());"

echo.
pause
