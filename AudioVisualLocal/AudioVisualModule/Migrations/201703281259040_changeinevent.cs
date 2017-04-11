namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeinevent : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.FileEvents", "File_Id", "dbo.Files");
            DropForeignKey("dbo.FileEvents", "Event_Id", "dbo.Events");
            DropIndex("dbo.FileEvents", new[] { "File_Id" });
            DropIndex("dbo.FileEvents", new[] { "Event_Id" });
            DropTable("dbo.FileEvents");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.FileEvents",
                c => new
                    {
                        File_Id = c.Int(nullable: false),
                        Event_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.File_Id, t.Event_Id });
            
            CreateIndex("dbo.FileEvents", "Event_Id");
            CreateIndex("dbo.FileEvents", "File_Id");
            AddForeignKey("dbo.FileEvents", "Event_Id", "dbo.Events", "Id", cascadeDelete: true);
            AddForeignKey("dbo.FileEvents", "File_Id", "dbo.Files", "Id", cascadeDelete: true);
        }
    }
}
