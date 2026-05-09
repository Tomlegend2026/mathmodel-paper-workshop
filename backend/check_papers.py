"""检查并初始化论文知识库数据"""
import asyncio
import sqlite3
from datetime import datetime

def check_and_seed_papers():
    """检查并插入测试数据"""
    db_path = "mathmodel.db"
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 检查表是否存在
    cursor.execute("""
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='paper_knowledge'
    """)
    
    if not cursor.fetchone():
        print("❌ 表 paper_knowledge 不存在")
        print("请先运行 python init_db.py 初始化数据库")
        conn.close()
        return
    
    # 检查是否有数据
    cursor.execute("SELECT COUNT(*) FROM paper_knowledge")
    count = cursor.fetchone()[0]
    
    if count > 0:
        print(f"✅ 已有 {count} 篇论文数据")
        cursor.execute("SELECT id, title, competition, year FROM paper_knowledge LIMIT 3")
        papers = cursor.fetchall()
        for p in papers:
            print(f"  - ID: {p[0]}, 标题: {p[1][:30]}..., 竞赛: {p[2]}, 年份: {p[3]}")
    else:
        print("⚠️  数据库为空，正在插入测试数据...")
        
        # 插入3篇示例论文
        now = datetime.now().isoformat()
        test_papers = [
            (
                "基于改进粒子群算法的无人机路径规划",
                "2023年全国大学生数学建模竞赛",
                2023,
                "本科组",
                "国家一等奖",
                "粒子群算法,路径规划,无人机,优化算法",
                "针对无人机路径规划问题，提出了一种改进的粒子群优化算法。通过引入自适应惯性权重和交叉变异操作，有效避免了算法陷入局部最优。实验结果表明，该方法在复杂环境下的路径规划效果优于传统算法。",
                "改进粒子群算法(PSO)",
                now,
                now
            ),
            (
                "多目标优化在城市交通流量控制中的应用",
                "2022年全国大学生数学建模竞赛",
                2022,
                "本科组",
                "国家二等奖",
                "多目标优化,遗传算法,交通流量,NSGA-II",
                "本文针对城市交通信号灯控制问题，建立了多目标优化模型。采用NSGA-II算法求解，同时优化通行效率和等待时间。模型考虑了高峰和平峰时段的差异化控制策略，在实际路口数据上取得了良好效果。",
                "NSGA-II,多目标优化",
                now,
                now
            ),
            (
                "基于深度学习的图像分类与目标检测",
                "2021年美赛",
                2021,
                "研究生组",
                "Finalist",
                "深度学习,CNN,YOLO,目标检测,图像分类",
                "本文提出了一种基于卷积神经网络的图像分类与目标检测综合框架。通过迁移学习和数据增强技术，在有限样本下实现了高精度的分类效果。同时结合YOLO算法实现实时目标检测，模型在多个公开数据集上表现优异。",
                "CNN,YOLOv5,迁移学习",
                now,
                now
            ),
        ]
        
        cursor.executemany("""
            INSERT INTO paper_knowledge 
            (title, competition, year, category, award_level, search_keywords, abstract, methods_used, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, test_papers)
        
        conn.commit()
        print(f"✅ 成功插入 {len(test_papers)} 篇测试论文")
    
    conn.close()

if __name__ == "__main__":
    check_and_seed_papers()
