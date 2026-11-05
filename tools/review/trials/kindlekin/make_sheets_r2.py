from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font=lambda s: ImageFont.truetype(F,s)
BG='#f6f4ef'; W=1000; big=250; small=140
def L(f,s): return Image.open(f).convert('RGB').resize((s,s),Image.LANCZOS)
rows=[('OLD (live today)','#222',[('old/34-s1.jpg','Hatchling'),('old/34-s2.jpg','Adolescent (rejected)'),('old/34-s3.jpg','Legend (rejected)')]),
      ('ROUND 1\n(rejected)','#b91c1c',[('picks/34-s1.jpg','Hatchling'),('picks/34-s2.jpg','r1 Adol B (angry/style)'),('picks/34-s3.jpg','r1 Legend F (too little)')]),
      ('ROUND 2\nPICKS','#15803d',[('r2/picks/34-s1.jpg','Hatchling (kept)'),('r2/picks/34-s2.jpg','Tea Apprentice = r2 s2 B'),('r2/picks/34-s3.jpg','Hearth-Sage = r2 s3 D')])]
opt=[('R2 Adolescent',[('r2/options/s2-A.jpg','A  cup, sitting',0),('r2/options/s2-B.jpg','B  PICK  kettle, standing',1),('r2/options/s2-C.jpg','C  trot + tea basket',0),('r2/options/s2-D.jpg','D  pouring on cushion',0)]),
     ('R2 Legend 1',[('r2/options/s3-A.jpg','A  FAIL near-copy of s2 B',2),('r2/options/s3-B.jpg','B  lantern ring, cushion',0),('r2/options/s3-C.jpg','C  FAIL letter-like trim',2),('r2/options/s3-D.jpg','D  PICK  lantern sage',1)]),
     ('R2 Legend 2',[('r2/options/s3-E.jpg','E  runner-up  tail halo',0),('r2/options/s3-F.jpg','F  FAIL 2-spout kettle',2),('r2/options/s3-G.jpg','G  C redo, plain trim',0)])]
H=50+3*(big+40)+40+3*(small+34)+10
im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
d.text((10,10),'Kindlekin #34 - round 2 (draft, local only)',fill='#111',font=font(22)); y=50
for lab,col,items in rows:
    d.multiline_text((10,y+big//2-16),lab,fill=col,font=font(15))
    for i,(f,c) in enumerate(items):
        x=170+i*(big+20); im.paste(L(f,big),(x,y)); d.text((x,y+big+4),c,fill='#333',font=font(12))
    y+=big+40
d.text((10,y),'ROUND 2 - ALL OPTIONS',fill='#111',font=font(15)); y+=28
for lab,items in opt:
    d.text((10,y+small//2-8),lab,fill='#333',font=font(12))
    for i,(f,c,k) in enumerate(items):
        x=170+i*(small+65); im.paste(L(f,small),(x,y)); d.text((x,y+small+3),c,fill=['#555','#15803d','#b91c1c'][k],font=font(10))
    y+=small+34
im.save('review-r2.png')
S=2; PW,PH=390*S,844*S
ph=Image.new('RGB',(PW,PH),'#1e1b2e'); d=ImageDraw.Draw(ph)
d.rectangle((0,0,PW,50*S),fill='#ea580c'); d.text((14*S,14*S),'Board (390x844 phone) - round 2',fill='white',font=font(15*S))
y=62*S; card=114*S; gap=(PW-3*card)//4
for title,files in [('OLD',['old/34-s1.jpg','old/34-s2.jpg','old/34-s3.jpg']),('ROUND 1 (rejected)',['picks/board/34-s1.jpg','picks/board/34-s2.jpg','picks/board/34-s3.jpg']),('ROUND 2 PICKS',['r2/picks/board/34-s1.jpg','r2/picks/board/34-s2.jpg','r2/picks/board/34-s3.jpg'])]:
    d.text((14*S,y),title+' - board thumb ~114px',fill='white',font=font(11*S)); y+=20*S
    for i,f in enumerate(files):
        x=gap+i*(card+gap); t=Image.open(f).convert('RGB').resize((360,360),Image.LANCZOS).resize((card,card),Image.LANCZOS)
        d.rounded_rectangle((x-3*S,y-3*S,x+card+3*S,y+card+24*S),radius=10*S,fill='#2d2945'); ph.paste(t,(x,y))
        d.text((x+4*S,y+card+5*S),['Hatchling','Apprentice','Hearth-Sage'][i],fill='#fde68a',font=font(11*S))
    y+=card+38*S
d.text((14*S,y),'ROUND 2 - small avatar (56px)',fill='white',font=font(11*S)); y+=20*S
for i,f in enumerate(['r2/picks/board/34-s1.jpg','r2/picks/board/34-s2.jpg','r2/picks/board/34-s3.jpg','r2/picks/board/34-s3-alt-E.jpg']):
    t=Image.open(f).resize((56*S,56*S),Image.LANCZOS); m=Image.new('L',t.size,0); ImageDraw.Draw(m).ellipse((0,0,56*S,56*S),fill=255); ph.paste(t,(20*S+i*80*S,y),m)
d.text((20*S+3*80*S,y+60*S),'alt E',fill='#ccc',font=font(10*S)); y+=84*S
s=min(PH-y-8*S,180*S)
d.text((14*S,y),'Legend D vs alt E',fill='white',font=font(11*S)); y+=18*S; s=min(PH-y-6*S,180*S)
ph.paste(L('r2/picks/34-s3.jpg',s),(14*S,y)); ph.paste(L('r2/picks/34-s3-alt-E.jpg',s),(PW-14*S-s,y))
ph.save('phone-check-r2.png')
