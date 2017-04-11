namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeinfileclass : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Files", "Event_Id", "dbo.Events");
            DropIndex("dbo.Files", new[] { "Event_Id" });
            CreateTable(
                "dbo.FileEvents",
                c => new
                    {
                        File_Id = c.Int(nullable: false),
                        Event_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.File_Id, t.Event_Id })
                .ForeignKey("dbo.Files", t => t.File_Id, cascadeDelete: true)
                .ForeignKey("dbo.Events", t => t.Event_Id, cascadeDelete: true)
                .Index(t => t.File_Id)
                .Index(t => t.Event_Id);
            
            AddColumn("dbo.Files", "EventId", c => c.String());
            DropColumn("dbo.Files", "Event_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Files", "Event_Id", c => c.Int());
            DropForeignKey("dbo.FileEvents", "Event_Id", "dbo.Events");
            DropForeignKey("dbo.FileEvents", "File_Id", "dbo.Files");
            DropIndex("dbo.FileEvents", new[] { "Event_Id" });
            DropIndex("dbo.FileEvents", new[] { "File_Id" });
            DropColumn("dbo.Files", "EventId");
            DropTable("dbo.FileEvents");
            CreateIndex("dbo.Files", "Event_Id");
            AddForeignKey("dbo.Files", "Event_Id", "dbo.Events", "Id");
        }
    }
}
