rollout kickLineProfile "地脚线数据输出" width:217 height:430
(
	edittext 'edt1' "" pos:[12,73] width:189 height:184 align:#left
	button 'getAllDatas' "获取所选的样条线数据" pos:[36,9] width:139 height:30 align:#left
	button 'copyAllDatas' "复制全部数据" pos:[46,263] width:116 height:28 align:#left
	-- 当"获取所选的样条线数据"按钮被单击的时候调用的函数。
	spinner 'spn1' "缩放值：" pos:[26,48] width:98 height:16 range:[0,100,1] scale:0.1 align:#left  
    label 'lbl2' "注意事项：1、绘制踢脚线的轮廓的时候请保证是在3ds max的前视图绘制。2、绘制踢脚线的第一点请保证其在坐标(0,0)点。3、如果绘制出的踢脚线导入到程序中发生了法线翻转，请使用样条线执行一下Reverse命令再重新输出。" pos:[13,305] width:187 height:186 align:#left
  
	-- 当"复制全部数据"按钮被单击的时候调用的数据。

	on getAllDatas pressed do
	(
		if($==undefined)then
		(
			messageBox "请先选择一条样条线"
		)else
		( 
		    edt1.text=""
			vertexCount=numknots $ 1
	        for k = 1 to vertexCount do 
	        (
		       vertexPos=getKnotPoint $ 1 k 
			   xValue=(vertexPos[1]*spn1.value) as string
			   yValue=(vertexPos[3]*spn1.value) as string
			   lastWord=",\r\n"
			   if( k==vertexCount)then
				(
					lastWord=""
				)
			   edt1.text+= ("["+xValue+","+yValue+"]"+lastWord)
		    )
		)
	)
	on copyAllDatas pressed do
		(
			 setclipboardText  edt1.text
		)
)
createDialog kickLineProfile