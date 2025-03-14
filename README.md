# AsiaToken-亞大幣

# LINE 官方操作手冊

## 目錄

> 加入 LINE 官方帳號
> 

**新增**

- 開戶介紹

**查詢**

- 錢包帳戶
- 我的資產
- 交易紀錄

**更改**

- 資產移轉

---

## 加入官方帳號

<aside>
📷 掃描官方 QR Code

![Untitled](images/Untitled.png)

</aside>

1. 開啟 LINE 應用程式。
2. 點選下方主頁。
3. 點選右上方加入好友按鈕。
4. 點選上方行動條碼。
5. 掃描 QR Code 。
6. 顯示官方帳戶資訊後點選加入好友。

![Untitled](Untitled%201.png)

---

---

## **開戶介紹**

1. 進入官方帳號聊天室。
2. 點選【開戶】。
3. 等待系統回復開戶資訊。
4. 系統回復開戶資訊。
5. 更改圖文單樣式。

<aside>
💡 Flex-message

![Untitled](Untitled%202.png)

</aside>

![Untitled](Untitled%203.png)

![Untitled](Untitled%204.png)

---

---

## **錢包帳戶**

1. 點選錢包帳戶
2. 等待系統回復
3. 顯示錢包地址【QR Code】

<aside>
📷 Flex-message

![Untitled](Untitled%205.png)

</aside>

![Untitled](Untitled%206.png)

![Untitled](Untitled%207.png)

---

---

## 我的資產

1. 點選資產
2. 等待系統回復
3. 顯示使用者目前餘額

<aside>
📷 Flex-message

![Untitled](Untitled%208.png)

</aside>

![Untitled](Untitled%209.png)

![Untitled](Untitled%2010.png)

---

---

## 交易紀錄

1. 點選資產
2. 點選回復訊息下方的交易紀錄按鈕。
3. 等待系統回復
4. 顯示近五筆的交易紀錄
- 轉出【紅色顯示】
- 轉入【綠色顯示】
- 無資料【灰色顯示】

> **內容資訊**
> 
> - 交易名稱
> - 交易資訊
> - 交易對象
> - 交易數量

![Untitled](Untitled%2011.png)

<aside>
📷 Flex-message

![Untitled](Untitled%2012.png)

![Untitled](Untitled%2013.png)

![Untitled](Untitled%2014.png)

</aside>

<aside>
⚠️ LINE Reply Message API 只能提供五筆的滾動視窗。

</aside>

---

---

## 資產移轉

### Part 1.

> **交易頁面【取得資訊】**
> 
> 1. 點選資產
> 2. 點選回復訊息下方的資產移轉按鈕。
>     
>     ![Untitled](Untitled%208.png)
>     

1. 顯示浮動視窗
2. Loading…..
    
    ![Untitled](Untitled%2015.png)
    

1.  系統抓取使用者帳戶餘額。
2. 等待抓取資訊後顯示提示視窗【餘額】
3. 點選確認
    
    ![Untitled](Untitled%2016.png)
    

<aside>
💡 輸入數量可點選 Max 按鈕 或 手動輸入，不可超出目前持有數量，如超出數量系統將顯示提示訊息【餘額不足】。

</aside>

> **交易頁面【轉出數量】**
> 
> 1. 進入交易頁面【轉出數量】
>     
>     ![Untitled](Untitled%2017.png)
>     

**手動輸入**

1. 使用者輸入數量，點選輸入框輸入並送出。
    
    ![Untitled](Untitled%2018.png)
    

- **使用按鈕**
1. 使用者點選最大值按鈕並送出。
    
    ![Untitled](Untitled%2019.png)
    

### Part 2.

> **掃描頁面【嵌入式】**
> 

1. 系統將請求主鏡頭使用權限。
    
    ![Untitled](Untitled%2020.png)
    

1. 點選確認，啟用掃描視窗。
    
    ![Untitled](Untitled%2021.png)
    

1. 鏡頭對準 QR Code【錢包地址】，並顯示結果
    
    ![Untitled](Untitled%2022.png)
    

### Part 3.

> **確認交易頁面**
> 
1. 顯示交易資訊，選取確認或取消按鈕。
    
    ![Untitled](Untitled%2023.png)
    

**確認交易**

1. 確認資訊無誤，點選確認，進入交易階段。
    
    ![Untitled](Untitled%2024.png)
    

**取消交易**

1. 反悔交易或資訊有誤，點選取消退出交易。
    
    ![Untitled](Untitled%2025.png)
    
- 顯示交易資訊，如確認無誤點選確認，若資訊錯誤或反悔交易可點選取消，系統將清除該筆資訊停止交易。

---

### 注意事項

<aside>
💡

1. 當前畫面停留 1分後 時間到將清除所有交易流程紀錄。                                                    
2. 當網頁關閉 並重新開啟網頁判斷是否超過1分鐘 是:清除網頁資訊 否:繼續顯示網頁並繼續交易。
3. 輸入交易數量進行比對使用者持有數量 小於:繼續交易流程 大於:alert(餘額不足)。 

![Untitled](Untitled%2026.png)

**1.**

![Untitled](Untitled%2027.png)

**2.**

![Untitled](Untitled%2028.png)

**3.**

</aside>
